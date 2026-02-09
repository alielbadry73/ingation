# Focus Timer Widget - User Guide

## 🎯 What's New

A **floating timer widget** now appears on all dashboard pages when you have an active focus session running!

## ✨ Features

### 1. **Persistent Timer Display**
- Widget appears in the bottom-right corner of any page
- Shows countdown timer in real-time
- Displays the timer mode emoji (🍅 Pomodoro, ☕ Short Break, etc.)
- Automatically updates every second

### 2. **Control Buttons**
The widget includes three action buttons:

#### 📤 Open Focus Mode
- Opens the full Focus Mode page
- Lets you access all focus features

#### ⏸️ Pause Timer
- Pauses the countdown
- Saves current time remaining
- Widget disappears when paused
- Resume from Focus Mode page

#### 🛑 Stop Timer
- Completely stops and deletes the timer
- Shows confirmation dialog
- Clears timer from all pages

### 3. **Auto-Completion**
- When timer reaches 00:00, automatically:
  - Saves session to history
  - Shows completion notification
  - Plays completion sound
  - Hides widget

### 4. **Smart Display**
- Only shows when timer is actively running
- Hides on Focus Mode page itself (no duplicate)
- Responsive design for mobile devices
- Beautiful gradient styling matching Focus Mode

## 🚀 How to Use

### Starting a Timer

1. **Go to Focus Mode**
   - Click "Focus Mode" from any dashboard
   - Or visit `http://localhost:3000/focus-mode.html`

2. **Choose Timer Mode**
   - 🍅 Pomodoro (25 min)
   - ☕ Short Break (5 min)
   - 🌟 Long Break (15 min)
   - ⚙️ Custom (your choice)

3. **Start Timer**
   - Click "Start" button
   - Timer begins counting down

4. **Navigate Away**
   - Go to any dashboard page
   - Widget appears automatically!
   - Timer continues running

### Using the Widget

#### While on Any Dashboard:
```
┌─────────────────────┐
│  🍅 Focus Mode      │
│      23:45          │
│  [📤] [⏸️] [🛑]    │
└─────────────────────┘
```

- **See time remaining** at a glance
- **Click 📤** to open Focus Mode
- **Click ⏸️** to pause
- **Click 🛑** to stop (with confirmation)

### Pausing the Timer

1. Click the ⏸️ pause button on widget
2. Widget disappears
3. Timer state is saved
4. To resume:
   - Go back to Focus Mode page
   - Click "Resume" button

### Stopping the Timer

1. Click the 🛑 stop button
2. Confirm you want to stop
3. Timer is completely removed
4. Widget disappears

## 📱 Mobile Support

The widget is fully responsive:
- Smaller size on mobile devices
- Touch-friendly buttons
- Positioned to not block content
- Smooth animations

## 🎨 Visual Design

### Widget Appearance
- **Background**: Purple gradient matching Focus Mode
- **Position**: Bottom-right corner (fixed)
- **Shadow**: Soft glow effect
- **Animation**: Slides in from bottom
- **Font**: Monospace for timer (easy to read)

### Notifications
When timer completes:
- Green notification appears at top-right
- Shows "🎉 Focus session complete! Great job!"
- Plays completion sound
- Auto-dismisses after 5 seconds

## 🔧 Technical Details

### Files Added
- `js/focus-timer-widget.js` - Widget logic and UI

### Pages Updated
- `physics-dashboard.html` - Added widget script
- `mathematics-dashboard.html` - Added widget script
- `english-dashboard.html` - Added widget script
- (Add to other dashboards as needed)

### How It Works

1. **Checks localStorage** every second for timer state
2. **Calculates remaining time** based on elapsed time
3. **Updates display** in real-time
4. **Handles completion** automatically
5. **Syncs across tabs** (same localStorage)

### Data Storage

Timer state in localStorage:
```javascript
{
  mode: 'pomodoro',           // Timer mode
  timeRemaining: 1500,        // Seconds remaining
  totalTime: 1500,            // Total seconds
  isRunning: true,            // Running status
  sessionStartTime: 1234567890 // Start timestamp
}
```

## 🎯 Benefits

### For Students
- ✅ **Stay focused** while browsing course materials
- ✅ **Track time** without keeping Focus Mode open
- ✅ **Quick controls** from any page
- ✅ **Never lose track** of study sessions

### For Productivity
- ✅ **Pomodoro technique** made easy
- ✅ **Visual reminder** to stay on task
- ✅ **Session tracking** for progress
- ✅ **Flexible control** without interruption

## 💡 Pro Tips

1. **Start timer before studying**
   - Set 25-minute Pomodoro
   - Navigate to course materials
   - Widget keeps you accountable

2. **Use breaks wisely**
   - Set 5-minute break timer
   - Widget reminds you when break ends
   - Get back to studying on time

3. **Custom timers for tasks**
   - Set timer for specific assignment
   - Work until timer completes
   - Track actual time spent

4. **Don't pause unnecessarily**
   - Let timer run to build discipline
   - Only pause for real interruptions
   - Complete full sessions for best results

## 🐛 Troubleshooting

### Widget Not Appearing?
1. Make sure timer is started in Focus Mode
2. Check that you're on a dashboard page (not Focus Mode itself)
3. Refresh the page
4. Check browser console for errors

### Timer Not Updating?
1. Check localStorage is enabled
2. Try stopping and restarting timer
3. Clear browser cache
4. Restart browser

### Widget Blocking Content?
- Widget is positioned bottom-right
- Should not block important content
- On mobile, may need to scroll past it
- Can always stop timer to hide widget

## 🚀 Future Enhancements

Possible future features:
- Drag to reposition widget
- Minimize/expand widget
- Custom widget themes
- Desktop notifications
- Sound alerts at intervals
- Multiple timers support

## 📊 Session Tracking

All completed sessions are saved:
- View in Focus Mode "Session Stats"
- See today, this week, all-time totals
- Review recent session history
- Track your productivity over time

---

**Enjoy your focused study sessions!** 🎯📚✨
