# Final Music Widget Test Plan

## Test Scenario: Complete User Journey

### Step 1: Start Music in Focus Mode
1. Open `http://localhost:3000/focus-mode.html`
2. Click on "Lofi Hip Hop" category (🎧)
3. Click on "Chill Lofi Study Beats" track
4. **Expected Results:**
   - ✅ "Now Playing" section appears with audio player
   - ✅ Music starts playing immediately
   - ✅ Track shows green border and "Now Playing" indicator
   - ✅ Stop button appears on the playing track
   - ✅ **Music widget does NOT appear** (this is the fix!)

### Step 2: Navigate to Dashboard
1. Click "Back to Dashboard" button
2. **Expected Results:**
   - ✅ Music continues playing
   - ✅ Music widget appears in bottom-left corner
   - ✅ Widget shows: "Chill Lofi Study Beats"
   - ✅ Widget shows: "🎧 Lofi Hip Hop"
   - ✅ Widget has 3 buttons: Stop (⏹), Open Focus Mode (📤), Close (✕)

### Step 3: Test Widget Controls
1. **Test Play/Stop Button:**
   - Click the Stop button (⏹)
   - **Expected:** Music stops, widget disappears
   - Refresh page
   - **Expected:** Widget does not reappear (state cleared)

2. **Test Open Focus Mode Button:**
   - Start music again in Focus Mode
   - Navigate to dashboard
   - Click Open Focus Mode button (📤)
   - **Expected:** Navigates to focus-mode.html
   - **Expected:** Widget does NOT appear on focus-mode.html

3. **Test Close Button:**
   - Navigate back to dashboard
   - Click Close button (✕)
   - **Expected:** Music stops, widget disappears, state cleared

### Step 4: Test Persistence
1. Start music in Focus Mode
2. Navigate to `student-dashboard.html`
3. **Expected:** Widget appears
4. Navigate to `physics-dashboard.html`
5. **Expected:** Widget still appears, music continues
6. Navigate to `mathematics-dashboard.html`
7. **Expected:** Widget still appears, music continues
8. Navigate to `english-dashboard.html`
9. **Expected:** Widget still appears, music continues
10. Navigate back to `focus-mode.html`
11. **Expected:** Widget disappears, music continues in "Now Playing" section

## Browser Console Checks

### On Focus Mode Page
```javascript
// Check if widget initialization was skipped
console.log(window.location.pathname.includes('focus-mode.html')); // Should be true

// Check music state
console.log(localStorage.getItem('focusMusicState')); 
// Should show: {"isPlaying":true,"trackTitle":"...","streamUrl":"..."}
```

### On Dashboard Page
```javascript
// Check if widget should show
console.log(window.location.pathname.includes('focus-mode.html')); // Should be false

// Check music state
console.log(localStorage.getItem('focusMusicState')); 
// Should show: {"isPlaying":true,"trackTitle":"...","streamUrl":"..."}

// Check if widget exists
console.log(document.querySelector('.focus-music-widget')); 
// Should show: <div class="focus-music-widget">...</div>

// Check if widget is visible
console.log(document.querySelector('.focus-music-widget').style.display); 
// Should show: "flex"
```

## Expected Console Messages

### Normal Messages (OK)
```
Autoplay prevented: AbortError: The play() request was interrupted...
```
This is normal browser behavior when autoplay is blocked. The widget handles this gracefully.

### Extension Messages (OK, Not Related)
```
Focus Mode Extension not detected
⚠️ Focus Mode Extension not installed. Website blocking will be limited.
```
These are from the Focus Mode extension sync script and are not related to the music widget.

## Troubleshooting

### Issue: Widget appears on focus-mode.html
**Solution:** Clear browser cache and hard reload (Ctrl+Shift+R)
**Verify:** Check that the updated `focus-music-widget.js` is loaded

### Issue: Widget doesn't appear on dashboard
**Check:**
1. Is music playing? Check localStorage: `localStorage.getItem('focusMusicState')`
2. Is `isPlaying` true? `JSON.parse(localStorage.getItem('focusMusicState')).isPlaying`
3. Is widget script loaded? Check Network tab for `focus-music-widget.js`
4. Any console errors? Check browser console

### Issue: Music stops when navigating
**Check:**
1. Is the same stream URL being used? All tracks currently use the same stream.
2. Is the audio element being recreated? The widget checks for existing audio.
3. Browser autoplay policy? Some browsers block autoplay on navigation.

### Issue: Play/Stop button doesn't work
**Check:**
1. Is the button visible? Inspect element to verify
2. Is the audio element present? `document.getElementById('audioPlayer')`
3. Any console errors when clicking? Check browser console
4. Is the `toggleMusicPlayback` function defined? `typeof window.toggleMusicPlayback`

## Success Criteria

### ✅ All Tests Pass
- [ ] Music starts in Focus Mode
- [ ] Widget does NOT appear on focus-mode.html
- [ ] Widget appears on all dashboard pages
- [ ] Music continues across navigation
- [ ] Play/Stop button works correctly
- [ ] Open Focus Mode button navigates correctly
- [ ] Close button stops music and hides widget
- [ ] State persists across page reloads
- [ ] Stop button clears state

### ✅ No Console Errors
- [ ] No JavaScript errors in console
- [ ] Only expected autoplay warnings (normal)
- [ ] Extension messages are unrelated (OK)

### ✅ Visual Verification
- [ ] Widget positioned correctly (bottom-left)
- [ ] Widget shows correct track info
- [ ] Widget buttons are clickable
- [ ] Widget animations work smoothly
- [ ] Widget is responsive on mobile

## Test Results Template

```
Date: ___________
Browser: ___________
OS: ___________

Step 1: Start Music in Focus Mode
- Music starts: [ ] Pass [ ] Fail
- Widget hidden on focus-mode.html: [ ] Pass [ ] Fail

Step 2: Navigate to Dashboard
- Music continues: [ ] Pass [ ] Fail
- Widget appears: [ ] Pass [ ] Fail
- Correct track info: [ ] Pass [ ] Fail

Step 3: Test Widget Controls
- Play/Stop button: [ ] Pass [ ] Fail
- Open Focus Mode button: [ ] Pass [ ] Fail
- Close button: [ ] Pass [ ] Fail

Step 4: Test Persistence
- Widget persists across pages: [ ] Pass [ ] Fail
- Widget hidden on focus-mode.html: [ ] Pass [ ] Fail

Overall Result: [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
_________________________________
```

## Quick Test Commands

### Start Test Music
```javascript
// Simulate music playing
localStorage.setItem('focusMusicState', JSON.stringify({
    isPlaying: true,
    categoryName: 'Lofi Hip Hop',
    categoryIcon: '🎧',
    trackTitle: 'Chill Lofi Study Beats',
    trackUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    videoId: 'lTRiuFIWV54',
    categoryIndex: 0,
    trackIndex: 1
}));
location.reload();
```

### Stop Test Music
```javascript
localStorage.removeItem('focusMusicState');
location.reload();
```

### Check Widget Status
```javascript
console.log('Current page:', window.location.pathname);
console.log('On focus-mode.html:', window.location.pathname.includes('focus-mode.html'));
console.log('Music state:', localStorage.getItem('focusMusicState'));
console.log('Widget element:', document.querySelector('.focus-music-widget'));
console.log('Widget visible:', document.querySelector('.focus-music-widget')?.style.display);
```

## Summary

The music widget fix ensures that:
1. Widget only appears on dashboard pages (NOT on focus-mode.html)
2. Music playback continues seamlessly across navigation
3. Widget controls work correctly (Play/Stop, Open Focus Mode, Close)
4. State persists in localStorage for cross-page functionality

The single line fix (`if (window.location.pathname.includes('focus-mode.html')) return;`) prevents the widget from initializing on the Focus Mode page, solving the issue completely.
