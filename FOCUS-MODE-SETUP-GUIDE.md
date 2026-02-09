# Focus Mode Website Blocker - Complete Setup Guide

## Problem

The Focus Mode feature in your dashboard can track blocked websites, but **JavaScript cannot actually block external websites** like Instagram, Facebook, etc. due to browser security restrictions.

## Solution

Install the **Focus Mode Browser Extension** which runs at the browser level and can actually intercept and block navigation to distracting websites.

---

## Quick Start (5 Minutes)

### Step 1: Create Extension Icons

The extension needs three icon files. Here's the fastest way:

1. Go to https://favicon.io/emoji-favicons/
2. Search for "🎯" (target emoji)
3. Click "Download" to get the favicon package
4. Extract the ZIP file
5. Rename and copy these files to `focus-mode-extension/` folder:
   - `favicon-16x16.png` → `icon16.png`
   - `favicon-32x32.png` → `icon48.png` (or create 48x48 version)
   - `android-chrome-192x192.png` → resize to 128x128 and save as `icon128.png`

**Alternative:** Use any 16x16, 48x48, and 128x128 PNG images with a focus/lock/target theme.

### Step 2: Install the Extension

#### For Chrome/Edge/Brave:

1. Open your browser's extension page:
   - **Chrome**: Type `chrome://extensions/` in address bar
   - **Edge**: Type `edge://extensions/` in address bar
   - **Brave**: Type `brave://extensions/` in address bar

2. **Enable Developer Mode**
   - Look for a toggle switch in the top right corner
   - Turn it ON

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to your project folder
   - Select the `focus-mode-extension` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "IG Nation Focus Mode Blocker" in your extensions list
   - The extension should show as "Enabled"

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in your browser toolbar
   - Find "IG Nation Focus Mode Blocker"
   - Click the pin icon to keep it visible

#### For Firefox:

1. Type `about:debugging` in the address bar
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to `focus-mode-extension` folder
5. Select the `manifest.json` file

**Note:** Firefox removes temporary extensions when you close the browser.

### Step 3: Test It!

1. **Open Focus Mode**
   - Go to `http://localhost:3000/focus-mode.html`
   - You should see a console message: "✅ Synced with Focus Mode Extension"

2. **Block a Website**
   - Toggle ON "Instagram" in the Website Blocker section
   - Start the focus timer

3. **Try to Visit Instagram**
   - Open a new tab
   - Try to go to `instagram.com`
   - You should be redirected to a blocked page! 🎉

---

## How It Works

### Without Extension (Current Behavior)
```
User visits Instagram → JavaScript logs warning → User can still access Instagram ❌
```

### With Extension (New Behavior)
```
User visits Instagram → Extension intercepts request → Redirects to blocked page ✅
```

### Automatic Syncing

The extension automatically syncs with your Focus Mode dashboard:

1. **Every 2 seconds** while Focus Mode page is open
2. **Immediately** when you toggle a website on/off
3. **Immediately** when you start/pause/reset the timer

No manual syncing needed!

---

## Features

### ✅ Real Website Blocking
- Actually prevents navigation to blocked sites
- Works even if Focus Mode window is closed
- Blocks all subdomains (e.g., `www.instagram.com`, `m.instagram.com`)

### ✅ Timer Persistence
- Timer continues even if you close the Focus Mode window
- Reopen the page and timer resumes from where it left off
- Blocking continues as long as timer is running

### ✅ Smart Blocking
- Only blocks when timer is actively running
- Automatically unblocks when session ends
- Pausing timer stops blocking

### ✅ Extension Popup
Click the extension icon to see:
- Current timer status
- Time remaining
- Number of blocked sites
- Quick link to Focus Mode

---

## Troubleshooting

### Extension Not Blocking Sites?

**Check 1: Is the extension enabled?**
- Go to `chrome://extensions/` (or your browser's extension page)
- Make sure "IG Nation Focus Mode Blocker" is enabled
- Try toggling it off and on

**Check 2: Is the timer running?**
- The extension only blocks when the timer is actively running
- Check the extension popup to see timer status
- Make sure you clicked "Start" not just set the time

**Check 3: Are sites toggled ON?**
- Open Focus Mode page
- Check that the websites you want to block have red toggles (ON position)
- Try toggling off and on again

**Check 4: Is it syncing?**
- Open Focus Mode page
- Open browser console (F12)
- Look for message: "✅ Synced with Focus Mode Extension"
- If you see "Extension not detected", reload the extension

### Extension Not Syncing?

**Solution 1: Reload the extension**
1. Go to `chrome://extensions/`
2. Find "IG Nation Focus Mode Blocker"
3. Click the refresh/reload icon
4. Reopen Focus Mode page

**Solution 2: Check for errors**
1. Go to `chrome://extensions/`
2. Click "Details" on the extension
3. Click "Inspect views: service worker"
4. Check console for errors

**Solution 3: Reinstall**
1. Remove the extension
2. Close browser completely
3. Reopen browser
4. Follow installation steps again

### Sites Still Accessible?

**Domain Format:**
- Use `instagram.com` not `www.instagram.com`
- Use `facebook.com` not `m.facebook.com`
- The extension matches all subdomains automatically

**Cache Issues:**
- Clear browser cache
- Close all tabs of the blocked site
- Try in an incognito/private window

### Timer Not Persisting?

**Check localStorage:**
1. Open Focus Mode page
2. Open browser console (F12)
3. Type: `localStorage.getItem('focusTimerState')`
4. Should show timer data, not `null`

**If null:**
- Start the timer
- Wait 2 seconds
- Check again
- If still null, there may be a localStorage issue

---

## Advanced Usage

### Custom Blocked Sites

To add custom websites (not in the default list):

1. Open `focus-mode.html`
2. Find the `websites` array (around line 600)
3. Add your custom site:
```javascript
{ name: 'Custom Site', url: 'example.com', icon: '🌐', color: '#000000' }
```
4. Save and reload the page

### Blocking Schedules

To block sites at specific times (future feature):

1. Modify `background.js` in the extension
2. Add time-based logic to `shouldBlockUrl()` function
3. Reload the extension

### Export/Import Settings

To backup your blocked sites list:

**Export:**
```javascript
// In browser console on Focus Mode page
console.log(localStorage.getItem('blockedSites'));
// Copy the output
```

**Import:**
```javascript
// In browser console on Focus Mode page
localStorage.setItem('blockedSites', '["instagram.com","facebook.com"]');
// Reload the page
```

---

## Privacy & Security

### What the Extension Can Access

- ✅ **URLs you visit** - Only to check against blocked list
- ✅ **localStorage** - To sync with Focus Mode dashboard
- ✅ **Tab navigation** - To redirect blocked sites

### What the Extension CANNOT Do

- ❌ Read page content
- ❌ Access passwords or personal data
- ❌ Send data to external servers
- ❌ Track your browsing history
- ❌ Modify pages (except blocking)

### Data Storage

All data is stored **locally** on your computer:
- Blocked sites list: In browser's localStorage
- Timer state: In browser's localStorage
- Extension settings: In browser's extension storage

**Nothing is sent to any server.**

---

## Uninstalling

If you want to remove the extension:

1. Go to `chrome://extensions/` (or your browser's extension page)
2. Find "IG Nation Focus Mode Blocker"
3. Click "Remove"
4. Confirm removal

Your Focus Mode will still work, but website blocking will be limited to warnings only.

---

## Support

### Common Questions

**Q: Do I need to keep Focus Mode page open?**
A: No! Once the timer starts and syncs with the extension, you can close the page. The extension will continue blocking sites.

**Q: What happens if I close my browser?**
A: The timer state is saved. When you reopen the browser and visit Focus Mode, the timer will resume if time remains.

**Q: Can I use this on mobile?**
A: Not currently. Browser extensions work differently on mobile. Consider using built-in focus modes on iOS/Android.

**Q: Will this slow down my browser?**
A: No. The extension is very lightweight and only checks URLs against a small list.

**Q: Can I block YouTube but allow specific channels?**
A: Not currently. It's all-or-nothing per domain. This could be a future feature.

### Getting Help

If you're still having issues:

1. Check the browser console for error messages
2. Check the extension's service worker console
3. Try in a fresh browser profile
4. Verify all files are in the correct locations

---

## What's Next?

Future improvements planned:
- [ ] Custom website blocking (add any domain)
- [ ] Whitelist mode (block everything except allowed sites)
- [ ] Statistics dashboard (blocked attempts, time saved)
- [ ] Schedule-based blocking (block sites at specific times)
- [ ] Multiple blocking profiles (study, work, relax)
- [ ] Browser notifications when blocking attempts occur
- [ ] Export/import settings

---

## Summary

1. ✅ Create three icon files (16x16, 48x48, 128x128)
2. ✅ Load extension in browser (Developer Mode → Load Unpacked)
3. ✅ Open Focus Mode and start timer
4. ✅ Extension automatically syncs and blocks sites
5. ✅ Test by trying to visit Instagram or Facebook

**That's it! You now have real website blocking that actually works!** 🎉
