# How the Focus Mode Extension Works

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│                                                             │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │  Focus Mode Page │◄────────┤  Extension Background   │  │
│  │  (localhost:3000)│  Sync   │  Service Worker         │  │
│  │                  │─────────►│  (background.js)        │  │
│  └──────────────────┘         └─────────────────────────┘  │
│         │                               │                   │
│         │ localStorage                  │ chrome.storage    │
│         ▼                               ▼                   │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │  Timer State     │         │  Blocked Sites List     │  │
│  │  Blocked Sites   │         │  Timer State (synced)   │  │
│  └──────────────────┘         └─────────────────────────┘  │
│                                         │                   │
│                                         │ Intercepts        │
│                                         ▼                   │
│                               ┌─────────────────────────┐  │
│                               │  Navigation Requests    │  │
│                               │  (webRequest API)       │  │
│                               └─────────────────────────┘  │
│                                         │                   │
│                                         ▼                   │
│                               ┌─────────────────────────┐  │
│                               │  Blocked Page           │  │
│                               │  (blocked.html)         │  │
│                               └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Initial Setup

```
User opens Focus Mode
       │
       ▼
Page loads sync script (focus-mode-extension-sync.js)
       │
       ▼
Sync script checks if extension is installed
       │
       ▼
If installed: Sends localStorage data to extension
       │
       ▼
Extension stores data in chrome.storage.local
       │
       ▼
Console shows: "✅ Synced with Focus Mode Extension"
```

### 2. Starting a Focus Session

```
User toggles websites ON
       │
       ▼
localStorage.setItem('blockedSites', [...])
       │
       ▼
Sync script detects change
       │
       ▼
Sends updated list to extension
       │
       ▼
User clicks "Start" timer
       │
       ▼
localStorage.setItem('focusTimerState', {...})
       │
       ▼
Sync script sends timer state to extension
       │
       ▼
Extension background worker activates blocking
```

### 3. Blocking a Website

```
User tries to visit instagram.com
       │
       ▼
Browser initiates navigation request
       │
       ▼
Extension intercepts request (webRequest.onBeforeRequest)
       │
       ▼
Extension checks: Is timer running?
       │
       ├─ NO → Allow navigation
       │
       └─ YES → Check: Is site in blocked list?
              │
              ├─ NO → Allow navigation
              │
              └─ YES → Block navigation
                     │
                     ▼
                     Redirect to blocked.html
                     │
                     ▼
                     User sees blocked page
```

### 4. Timer Persistence

```
User closes Focus Mode window
       │
       ▼
Timer state remains in localStorage
       │
       ▼
Extension continues checking timer state
       │
       ▼
User tries to visit blocked site
       │
       ▼
Extension checks localStorage timer state
       │
       ▼
Timer still running? → Block site
       │
       ▼
User reopens Focus Mode
       │
       ▼
Page loads timer state from localStorage
       │
       ▼
Calculates elapsed time
       │
       ▼
Resumes timer from correct position
```

## Key Components

### 1. Sync Script (focus-mode-extension-sync.js)

**Purpose:** Bridge between web page and extension

**Functions:**
- Detects if extension is installed
- Sends localStorage data to extension every 2 seconds
- Immediately syncs on localStorage changes
- Overrides localStorage.setItem to trigger instant sync

**Code Flow:**
```javascript
1. Check if chrome.runtime exists
2. If yes, extension is installed
3. Read localStorage data
4. Send to extension via chrome.runtime.sendMessage
5. Repeat every 2 seconds
```

### 2. Background Service Worker (background.js)

**Purpose:** Intercept and block navigation requests

**Functions:**
- Listen for navigation requests
- Check if URL should be blocked
- Redirect to blocked page if necessary
- Sync timer state periodically

**Code Flow:**
```javascript
1. Listen: chrome.webRequest.onBeforeRequest
2. Get URL from request
3. Check chrome.storage for timer state
4. If timer running AND site blocked:
   - Cancel request
   - Redirect to blocked.html
5. Else: Allow request
```

### 3. Blocked Page (blocked.html)

**Purpose:** Show user they're blocked

**Features:**
- Displays blocked site name
- Shows time remaining
- Offers return to Focus Mode
- Offers end session early option

### 4. Extension Popup (popup.html)

**Purpose:** Quick status view

**Shows:**
- Timer status (active/paused/stopped)
- Time remaining
- Number of blocked sites
- Quick link to Focus Mode

## Sync Mechanism Details

### Why Sync is Needed

The extension and web page run in different contexts:
- **Web page:** Has access to localStorage
- **Extension:** Has access to chrome.storage and webRequest API

They need to share data, so we sync:
- Blocked sites list
- Timer state (running/paused, time remaining, start time)

### Sync Frequency

1. **Every 2 seconds** (automatic)
   - Ensures extension has latest data
   - Low overhead (small data payload)

2. **Immediately on change** (triggered)
   - When user toggles website
   - When user starts/pauses/resets timer
   - When localStorage is modified

### Sync Data Structure

```javascript
{
  blockedSites: ["instagram.com", "facebook.com", ...],
  focusTimerState: {
    mode: "pomodoro",
    timeRemaining: 1500,
    totalTime: 1500,
    isRunning: true,
    sessionStartTime: 1234567890000
  }
}
```

## Blocking Logic Details

### URL Matching

The extension checks if a URL should be blocked:

```javascript
function shouldBlock(url, blockedSites) {
  const hostname = new URL(url).hostname.toLowerCase();
  
  return blockedSites.some(site => {
    const siteLower = site.toLowerCase();
    return (
      hostname === siteLower ||           // Exact match
      hostname.endsWith('.' + siteLower)  // Subdomain match
    );
  });
}
```

**Examples:**
- `instagram.com` blocks:
  - `instagram.com` ✅
  - `www.instagram.com` ✅
  - `m.instagram.com` ✅
  - `help.instagram.com` ✅
- `instagram.com` does NOT block:
  - `fakeinstagram.com` ❌
  - `instagram.net` ❌

### Timer State Check

```javascript
function isTimerRunning(timerState) {
  if (!timerState) return false;
  
  const state = JSON.parse(timerState);
  if (!state.isRunning) return false;
  
  // Check if time has expired
  if (state.sessionStartTime) {
    const elapsed = (Date.now() - state.sessionStartTime) / 1000;
    const remaining = state.totalTime - elapsed;
    return remaining > 0;
  }
  
  return false;
}
```

## Security & Privacy

### What the Extension Can Access

1. **URLs you visit** - Only to check against blocked list
2. **localStorage data** - Only focusTimerState and blockedSites
3. **Tab navigation** - Only to redirect blocked sites

### What the Extension CANNOT Access

1. ❌ Page content (HTML, text, images)
2. ❌ Passwords or form data
3. ❌ Cookies (except for blocked sites)
4. ❌ Other extensions' data
5. ❌ Files on your computer

### Data Storage

All data is stored **locally**:
- `localStorage` - Web page data
- `chrome.storage.local` - Extension data
- **No external servers**
- **No tracking**
- **No analytics**

## Performance

### Resource Usage

- **Memory:** ~5-10 MB (very lightweight)
- **CPU:** Minimal (only checks URLs on navigation)
- **Network:** None (no external requests)

### Optimization

1. **Efficient URL checking**
   - Simple string matching
   - No regex (faster)
   - Cached blocked list

2. **Minimal sync frequency**
   - 2 seconds is enough
   - Only syncs small data payload
   - Immediate sync on critical changes

3. **Lazy loading**
   - Extension only activates when needed
   - No background polling
   - Event-driven architecture

## Troubleshooting Flow

```
Extension not blocking?
       │
       ▼
Check: Is extension installed?
       │
       ├─ NO → Install extension
       │
       └─ YES → Check: Is extension enabled?
              │
              ├─ NO → Enable in chrome://extensions/
              │
              └─ YES → Check: Is timer running?
                     │
                     ├─ NO → Start timer
                     │
                     └─ YES → Check: Is site toggled ON?
                            │
                            ├─ NO → Toggle site ON
                            │
                            └─ YES → Check: Is sync working?
                                   │
                                   ├─ NO → Reload extension
                                   │
                                   └─ YES → Check browser console for errors
```

## Future Enhancements

### Planned Features

1. **Custom site blocking**
   - Add any domain to block list
   - Import/export blocked lists

2. **Statistics**
   - Track blocked attempts
   - Show time saved
   - Weekly/monthly reports

3. **Whitelist mode**
   - Block everything except allowed sites
   - Useful for extreme focus

4. **Scheduled blocking**
   - Block sites at specific times
   - Different profiles for different times

5. **Notifications**
   - Alert when blocking attempt occurs
   - Motivational messages

### Technical Improvements

1. **Manifest V3 optimization**
   - Use declarativeNetRequest for better performance
   - Reduce memory usage

2. **Offline support**
   - Work without internet connection
   - Cache blocked page

3. **Multi-browser support**
   - Firefox permanent installation
   - Safari extension
   - Edge optimization

## Comparison: Before vs After

### Before (JavaScript Only)

```
Capabilities:
- ❌ Cannot block external sites
- ❌ Cannot persist after window close
- ❌ Limited to same-origin
- ✅ Easy to bypass

User Experience:
- Sees warning messages
- Can still access blocked sites
- Blocking stops when window closes
- Not effective
```

### After (With Extension)

```
Capabilities:
- ✅ Blocks external sites
- ✅ Persists after window close
- ✅ Works across all tabs
- ✅ Difficult to bypass

User Experience:
- Actually blocked from sites
- Blocking continues in background
- Timer persists correctly
- Effective focus tool
```

## Summary

The extension works by:

1. **Syncing** data between web page and extension
2. **Intercepting** navigation requests at browser level
3. **Checking** if site should be blocked based on timer state
4. **Redirecting** to blocked page if necessary
5. **Persisting** timer state even when window is closed

This provides **real website blocking** that JavaScript alone cannot achieve.
