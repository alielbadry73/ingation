# Focus Mode Extension - Quick Start Checklist

Follow these steps in order to get website blocking working:

## ☐ Step 1: Create Extension Icons (2 minutes)

1. Open `create-extension-icons.html` in your browser
2. Choose your preferred icon style (default 🎯 is good)
3. Click "📥 Download All Icons" button
4. Three files will download: `icon16.png`, `icon48.png`, `icon128.png`
5. Move these three files into the `focus-mode-extension` folder

**Verify:** You should see three PNG files in `focus-mode-extension/` folder

---

## ☐ Step 2: Install Browser Extension (3 minutes)

### For Chrome/Edge/Brave:

1. Open your browser
2. Type in address bar: `chrome://extensions/` (or `edge://extensions/` or `brave://extensions/`)
3. Turn ON the "Developer mode" toggle (top right corner)
4. Click "Load unpacked" button
5. Navigate to your project folder
6. Select the `focus-mode-extension` folder
7. Click "Select Folder"

**Verify:** You should see "IG Nation Focus Mode Blocker" in your extensions list with a green "Enabled" status

### For Firefox:

1. Type in address bar: `about:debugging`
2. Click "This Firefox" in left sidebar
3. Click "Load Temporary Add-on"
4. Navigate to `focus-mode-extension` folder
5. Select `manifest.json` file

**Note:** Firefox removes temporary extensions when browser closes

---

## ☐ Step 3: Test the Extension (2 minutes)

1. Open `http://localhost:3000/focus-mode.html`
2. Open browser console (Press F12)
3. Look for message: `✅ Synced with Focus Mode Extension`
4. If you see this message, syncing is working! ✅

**Troubleshooting:** If you don't see the sync message:
- Reload the extension in chrome://extensions/
- Refresh the Focus Mode page
- Check that extension is enabled

---

## ☐ Step 4: Block a Website (1 minute)

1. In Focus Mode page, find "Website Blocker" section
2. Toggle ON "Instagram" (switch should turn red)
3. Set timer to 5 minutes (or any duration)
4. Click "Start" button
5. Timer should start counting down

**Verify:** Timer is running and showing countdown

---

## ☐ Step 5: Test Blocking (30 seconds)

1. Open a new browser tab
2. Try to visit `instagram.com`
3. You should be redirected to a blocked page! 🎉

**If Instagram loads normally:**
- Go back to Focus Mode and check timer is running
- Check Instagram toggle is ON (red)
- Reload the extension and try again

---

## ☐ Step 6: Test Timer Persistence (1 minute)

1. With timer running, close the Focus Mode tab/window
2. Wait 10 seconds
3. Reopen `http://localhost:3000/focus-mode.html`
4. Timer should resume from where it left off! ✅

**Verify:** Timer continues counting down from correct time

---

## ☐ Step 7: Test Blocking Persistence (30 seconds)

1. With timer running, close Focus Mode window
2. Try to visit `instagram.com` in a new tab
3. Should still be blocked even with Focus Mode closed! ✅

**Verify:** Blocking works even when Focus Mode window is closed

---

## 🎉 Success Criteria

You've successfully set up Focus Mode if:

- ✅ Extension is installed and enabled
- ✅ Focus Mode page shows sync message
- ✅ Timer starts and counts down
- ✅ Instagram (or other toggled sites) are actually blocked
- ✅ Timer persists when window is closed
- ✅ Blocking persists when window is closed

---

## 🚨 Troubleshooting

### Extension not showing in browser?
- Make sure you selected the `focus-mode-extension` folder, not a file
- Check that all files are in the folder (manifest.json, background.js, etc.)
- Try restarting your browser

### Not syncing with Focus Mode?
- Check extension is enabled in chrome://extensions/
- Reload the extension (click refresh icon)
- Check browser console for error messages

### Sites not being blocked?
- Verify timer is running (not just set)
- Verify sites are toggled ON (red switch)
- Check extension popup shows "Focus mode active"
- Try clearing browser cache

### Timer not persisting?
- Check localStorage is enabled in browser
- Try in a regular window (not incognito)
- Check browser console for errors

---

## 📚 Additional Resources

- **Complete Guide:** `FOCUS-MODE-SETUP-GUIDE.md`
- **Technical Details:** `FOCUS-MODE-SOLUTION-SUMMARY.md`
- **Extension Docs:** `focus-mode-extension/README.md`

---

## ⏱️ Total Time: ~10 minutes

Once set up, you'll have a fully functional website blocker that actually works!

**Questions?** Check the troubleshooting sections in the guides above.
