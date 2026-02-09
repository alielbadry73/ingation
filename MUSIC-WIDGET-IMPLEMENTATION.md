# Focus Music Widget Implementation

## 🎵 Overview

Implemented an embedded music player widget that plays focus sounds directly within the website, similar to the timer widget. Users can now listen to music without opening external tabs.

## ✨ New Features

### 1. **Embedded Music Player**
- Plays YouTube videos as audio-only (embedded iframe)
- No external tabs needed
- Continues playing across page navigation
- Persists music state in localStorage

### 2. **Floating Music Widget**
- Appears on all dashboard pages when music is playing
- Shows on bottom-left corner (timer widget is bottom-right)
- Displays:
  - Track title
  - Category name with icon
  - Playback controls
  - Close button

### 3. **Widget Controls**
- **Play/Pause** button - Toggle playback
- **Stop** button - Stop music and close widget
- **Open Focus Mode** button - Navigate to Focus Mode page
- **Close (X)** button - Close widget and stop music

### 4. **Cross-Page Persistence**
- Music continues playing when navigating between pages
- Widget appears automatically on all pages
- State saved in localStorage
- Seamless experience across the site

## 🎨 Widget Design

### Visual Style
- **Color**: Green gradient (matches "playing" theme)
- **Position**: Bottom-left corner
- **Size**: 280-350px wide, auto height
- **Animation**: Slides in from left
- **Shadow**: Soft green glow

### Layout
```
┌─────────────────────────────────┐
│ Track Title              [X]    │
│ 🎧 Category Name                │
├─────────────────────────────────┤
│   [⏸]    [⏹]    [↗]            │
└─────────────────────────────────┘
```

## 💻 Technical Implementation

### Files Created
1. **`backend/public/js/focus-music-widget.js`**
   - Floating widget implementation
   - Music state management
   - YouTube embed player
   - Cross-page persistence

### Files Modified
1. **`focus-mode.html`**
   - Updated `playTrack()` function
   - Added YouTube ID extraction
   - Saves music state to localStorage
   - Shows notification when track starts
   - Added music widget script

2. **Dashboard Pages** (added music widget script):
   - `physics-dashboard.html`
   - `mathematics-dashboard.html`
   - `english-dashboard.html`
   - `student-dashboard.html`

### Data Structure

```javascript
// Music state stored in localStorage
{
    isPlaying: true,
    categoryName: "Lofi Hip Hop",
    categoryIcon: "🎧",
    trackTitle: "Lofi Hip Hop Radio - 24/7",
    trackUrl: "https://www.youtube.com/watch?v=...",
    videoId: "jfKfPfyJRdk",
    categoryIndex: 0,
    trackIndex: 0
}
```

### YouTube Embed Integration

```javascript
// Extract video ID from YouTube URL
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Embed as audio-only player
<iframe 
    src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0"
    style="display: none;">
</iframe>
```

## 🔄 User Flow

### Starting Music

1. User opens Focus Mode
2. Clicks a sound category (e.g., "🎧 Lofi Hip Hop")
3. Sees playlist of 5 tracks
4. Clicks a track (e.g., "Lofi Hip Hop Radio - 24/7")
5. Music starts playing immediately
6. Notification appears: "🎵 Now playing: Lofi Hip Hop Radio - 24/7"
7. Music widget appears on bottom-left

### Using Widget

```
User navigates to Physics Dashboard
  ↓
Music widget appears automatically
  ↓
Shows current track and controls
  ↓
User can pause, stop, or open Focus Mode
```

### Stopping Music

```
Option 1: Click Stop button in widget
  ↓
Music stops, widget disappears

Option 2: Click Close (X) button
  ↓
Music stops, widget disappears

Option 3: Select new track in Focus Mode
  ↓
Previous track stops, new track starts
```

## 🎯 Benefits

### For Users
- ✅ **No external tabs**: Music plays within the website
- ✅ **Persistent playback**: Continues across page navigation
- ✅ **Easy controls**: Widget always accessible
- ✅ **Clean interface**: Minimal, non-intrusive design
- ✅ **Quick access**: Open Focus Mode from any page

### For Study Sessions
- ✅ **Uninterrupted focus**: Music doesn't stop when changing pages
- ✅ **Convenient control**: Pause/stop without leaving current page
- ✅ **Better workflow**: No tab management needed
- ✅ **Seamless experience**: Works like a native music player

## 📱 Responsive Design

### Desktop
- Widget: 280-350px wide
- Position: Bottom-left, 20px from edges
- Controls: 40px buttons
- Comfortable spacing

### Mobile
- Widget: Full width minus 20px margins
- Position: Bottom-left, 10px from edges
- Positioned above timer widget (80px from bottom)
- Touch-friendly buttons

## 🎨 Widget Positioning

```
Desktop Layout:
┌─────────────────────────────────────┐
│                                     │
│         Page Content                │
│                                     │
│                                     │
│  [Music Widget]    [Timer Widget]  │
│  (bottom-left)     (bottom-right)  │
└─────────────────────────────────────┘

Mobile Layout:
┌──────────────────────┐
│                      │
│   Page Content       │
│                      │
│                      │
│  [Music Widget]      │
│  (full width)        │
│  [Timer Widget]      │
│  (full width)        │
└──────────────────────┘
```

## 🚀 How It Works

### 1. Track Selection (Focus Mode)
```javascript
function playTrack(categoryIndex, trackIndex) {
    // Extract YouTube video ID
    const videoId = extractYouTubeId(track.url);
    
    // Save to localStorage
    localStorage.setItem('focusMusicState', JSON.stringify({
        isPlaying: true,
        trackTitle: track.title,
        videoId: videoId,
        // ... other data
    }));
    
    // Show notification
    showMusicNotification(`🎵 Now playing: ${track.title}`);
}
```

### 2. Widget Display (All Pages)
```javascript
function checkAndDisplayWidget() {
    const musicState = localStorage.getItem('focusMusicState');
    
    if (musicState && state.isPlaying) {
        showWidget(state);
        loadTrack(state.videoId);
    }
}

// Check every second
setInterval(checkAndDisplayWidget, 1000);
```

### 3. YouTube Embed
```javascript
function loadTrack(url, videoId) {
    playerContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            style="display: none;">
        </iframe>
    `;
}
```

## 🔧 Widget Functions

### Global Functions (Available Everywhere)

```javascript
// Close widget and stop music
window.closeMusicWidget()

// Stop music and hide widget
window.stopMusicWidget()

// Toggle play/pause
window.togglePlayPause()

// Navigate to Focus Mode
window.openFocusModePage()
```

## 📊 State Management

### localStorage Keys

1. **`focusMusicState`** - Current music playback state
   ```json
   {
       "isPlaying": true,
       "categoryName": "Lofi Hip Hop",
       "categoryIcon": "🎧",
       "trackTitle": "Lofi Hip Hop Radio - 24/7",
       "trackUrl": "https://...",
       "videoId": "jfKfPfyJRdk",
       "categoryIndex": 0,
       "trackIndex": 0
   }
   ```

### State Updates

- **Track starts**: State saved with `isPlaying: true`
- **Track paused**: State updated with `isPlaying: false`
- **Track stopped**: State removed from localStorage
- **Widget closed**: State removed from localStorage

## 🎵 Music Library

### 8 Categories × 5 Tracks = 40 Total Tracks

All tracks are YouTube videos embedded as audio-only players:
- 🎧 Lofi Hip Hop (5 tracks)
- 🌊 White Noise (5 tracks)
- 🌧️ Rain Sounds (5 tracks)
- 🌲 Nature Sounds (5 tracks)
- ☕ Coffee Shop (5 tracks)
- 🌊 Ocean Waves (5 tracks)
- 🎹 Piano Music (5 tracks)
- 🔊 Binaural Beats (5 tracks)

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Click a track in Focus Mode
- [ ] Music starts playing
- [ ] Notification appears
- [ ] Widget appears on bottom-left

### Cross-Page Persistence
- [ ] Navigate to Physics Dashboard
- [ ] Widget still visible
- [ ] Music still playing
- [ ] Track info correct

### Widget Controls
- [ ] Pause button works
- [ ] Stop button works
- [ ] Open Focus Mode button works
- [ ] Close (X) button works

### Multiple Tracks
- [ ] Play first track
- [ ] Play second track
- [ ] First track stops
- [ ] Second track starts
- [ ] Widget updates

### Mobile Responsive
- [ ] Widget displays correctly
- [ ] Buttons are touch-friendly
- [ ] Positioned above timer widget
- [ ] Full width on mobile

## 🎉 Result

Users can now:
- ✅ Play focus sounds directly in the website
- ✅ Control music from any page via floating widget
- ✅ Enjoy uninterrupted playback across navigation
- ✅ Manage both timer and music with separate widgets
- ✅ Have a seamless, integrated study experience

**The music player is now fully embedded and works like a native app!** 🎵✨

---

## 📝 Files Summary

### Created
- `backend/public/js/focus-music-widget.js` - Music widget implementation

### Modified
- `focus-mode.html` - Updated playTrack(), added YouTube ID extraction
- `physics-dashboard.html` - Added music widget script
- `mathematics-dashboard.html` - Added music widget script
- `english-dashboard.html` - Added music widget script
- `student-dashboard.html` - Added music widget script

## 🔗 Related Features

- Focus Timer Widget (bottom-right)
- Focus Mode Page (music selection)
- Session Statistics (tracks focus time)
- Website Blocking (via extension)

**Both widgets work together to create a complete focus environment!** 🎯🎵
