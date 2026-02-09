# IG Nation Focus Mode Browser Extension

This browser extension enables **real website blocking** for the Focus Mode feature. Without this extension, the website blocker can only show warnings but cannot actually prevent you from visiting blocked sites like Instagram, Facebook, etc.

## Why Do I Need This?

JavaScript running on a webpage cannot block navigation to external websites due to browser security restrictions. This extension runs at the browser level and can actually intercept and block requests to distracting websites.

## Features

- ✅ **Actually blocks** websites (not just warnings)
- ✅ Syncs automatically with your Focus Mode dashboard
- ✅ Shows timer status in extension popup
- ✅ Blocks sites only when timer is running
- ✅ Automatically unblocks when session ends

## Installation Instructions

### For Chrome/Edge/Brave

1. **Open Extension Management Page**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`
   - Brave: Go to `brave://extensions/`

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `focus-mode-extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in your browser toolbar
   - Find "IG Nation Focus Mode Blocker"
   - Click the pin icon to keep it visible

### For Firefox

1. **Open about:debugging**
   - Type `about:debugging` in the address bar

2. **Load Temporary Add-on**
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Navigate to the `focus-mode-extension` folder
   - Select the `manifest.json` file

**Note:** In Firefox, temporary extensions are removed when you close the browser. For permanent installation, you would need to sign the extension through Mozilla.

## How to Use

1. **Install the extension** using the instructions above

2. **Open your Focus Mode dashboard**
   - Go to `http://localhost:3000/focus-mode.html`
   - The extension will automatically sync with your dashboard

3. **Select websites to block**
   - Toggle the switches for websites you want to block
   - The extension syncs automatically

4. **Start your focus session**
   - Set your timer and click Start
   - The extension will now block the selected websites

5. **Try visiting a blocked site**
   - You'll be redirected to a blocked page
   - The timer will continue running

## Checking Extension Status

Click the extension icon in your browser toolbar to see:
- Current timer status
- Time remaining
- Number of blocked sites
- Quick access to Focus Mode

## Troubleshooting

### Extension not blocking sites?

1. Check that the extension is enabled in your browser
2. Make sure you've started the timer in Focus Mode
3. Verify that the sites are toggled ON in the blocker list
4. Check the extension popup to confirm it's syncing

### Extension not syncing?

1. Open the Focus Mode page (`http://localhost:3000/focus-mode.html`)
2. Check the browser console for sync messages
3. Click "Sync with Dashboard" in the extension popup

### Sites still accessible?

- Make sure you're using the correct domain format (e.g., `instagram.com` not `www.instagram.com`)
- The extension blocks based on hostname matching
- Reload the extension if you just installed it

## Technical Details

- **Manifest Version:** 3 (latest Chrome extension format)
- **Permissions:** 
  - `storage` - Store blocked sites and timer state
  - `webRequest` - Intercept navigation requests
  - `declarativeNetRequest` - Block requests
  - `tabs` - Redirect to blocked page
- **Sync Frequency:** Every 2 seconds with the dashboard

## Privacy

This extension:
- ✅ Only runs locally on your computer
- ✅ Does not send any data to external servers
- ✅ Only monitors URLs to check against your blocked list
- ✅ Does not track your browsing history
- ✅ Open source - you can review all the code

## Uninstalling

To remove the extension:
1. Go to your browser's extension management page
2. Find "IG Nation Focus Mode Blocker"
3. Click "Remove"

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the extension is enabled
3. Try reloading the extension
4. Restart your browser

## Future Improvements

- [ ] Add custom website blocking (not just predefined list)
- [ ] Statistics on blocked attempts
- [ ] Whitelist mode (block everything except allowed sites)
- [ ] Schedule-based blocking
- [ ] Export/import blocked site lists
