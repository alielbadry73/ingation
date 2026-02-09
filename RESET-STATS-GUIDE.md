# Reset Session Stats Guide

## Method 1: Using the Reset Page (Recommended)

1. Open `reset-session-stats.html` in your browser
2. View current stats
3. Click "Reset All Stats" button
4. Confirm the action
5. Stats are now reset to zero

## Method 2: Browser Console (Quick)

Open browser console (F12) and run:

```javascript
// Clear all session history
localStorage.removeItem('focusSessions');

// Reload the page to see changes
location.reload();
```

## Method 3: Manual in Focus Mode

Add a reset button to the Focus Mode page itself.

### What Gets Reset

When you reset session stats, the following data is cleared:

- ✅ All session history
- ✅ Total time tracked
- ✅ Today's stats
- ✅ This week's stats
- ✅ All time stats
- ✅ Recent sessions list

### What Does NOT Get Reset

- ❌ Timer state (current running timer)
- ❌ Pomodoro count (current cycle progress)
- ❌ Music state
- ❌ Timer settings (Pomodoro duration, etc.)

## Files Created

- `reset-session-stats.html` - Standalone reset utility page

## Usage

### Option A: Standalone Page
```
http://localhost:3000/reset-session-stats.html
```

### Option B: Console Command
```javascript
localStorage.removeItem('focusSessions');
location.reload();
```

## Verification

After resetting, check Focus Mode page:
- Session Stats should show: 0h 0m
- Recent Sessions should be empty
- All counters should be zero

## Notes

- This action is permanent and cannot be undone
- Make sure you want to clear all history before proceeding
- The reset page shows current stats before clearing
- You can refresh stats without clearing them using the "Refresh Stats" button
