# Force Cache Clear Instructions

## The Problem
Your browser is aggressively caching the physics-lectures.html file, so you're not seeing the new design changes.

## Solution - Try These Steps in Order

### Step 1: Hard Refresh (Try First)
**Windows:**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- Then press `Ctrl + Shift + R` on the physics-lectures page

**Or:**
- Press `Ctrl + F5` multiple times

### Step 2: Clear Browser Cache Completely
1. Open browser settings
2. Go to Privacy/Clear browsing data
3. Select "Cached images and files"
4. Select "All time"
5. Click Clear data
6. Close and reopen browser
7. Navigate to physics-lectures.html

### Step 3: Open in Incognito/Private Window
- Press `Ctrl + Shift + N` (Chrome/Edge)
- Navigate to `http://localhost:3000/physics-lectures.html`
- This bypasses all cache

### Step 4: Disable Cache in DevTools
1. Press `F12` to open DevTools
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open
5. Refresh the page with `Ctrl + R`

### Step 5: Manual Cache Bust (If nothing else works)
Add `?v=123` to the URL:
```
http://localhost:3000/physics-lectures.html?v=123
```

Change the number each time you want to force a reload.

## How to Verify Changes Worked

Once the cache is cleared, you should see:

### Visual Changes:
1. **Lecture cards** have rounded corners (20px, not 16px)
2. **Hover effect** - cards lift 8px (not 4px) and show a colored line at the top
3. **Play button** is larger (70px, not 60px) and scales more on hover
4. **Thumbnails** are taller (220px, not 200px)
5. **Topic tags** have gradient backgrounds
6. **Better spacing** - more padding inside cards

### In Browser Console:
You should see:
```
CACHE BUSTER: v20250208-1700 - MODERN LECTURE DESIGN
```

If you inspect the `.lecture-card` element, you should see:
- `border-radius: 20px` (not 16px)
- A `::before` pseudo-element for the top border animation

## Still Not Working?

If none of the above works, the file might not be saved correctly. Let me know and I'll:
1. Create a completely new file with a different name
2. Or add inline styles directly to the HTML to override everything

## Alternative: Test File
I can create a standalone test file (`physics-lectures-new.html`) that you can open directly to see the new design without cache issues.
