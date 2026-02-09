# Railway Deployment Setup Guide

This guide explains how to configure your project to use Railway instead of localhost.

## ✅ What Has Been Updated

1. **API Configuration System**: Created `js/config.js` to manage backend URLs
2. **API Files Updated**: Both `js/api.js` and `backend/public/js/api.js` now use the config
3. **Backend Server**: Updated to use environment variables for frontend URLs
4. **HTML Files**: Updated `index.html` to use the config-based API URL

## 🔧 Configuration Steps

### Step 1: Update Railway URL in Config

Edit `js/config.js` and update the Railway URL:

```javascript
// Railway deployment URL - UPDATE THIS WITH YOUR ACTUAL RAILWAY URL
const RAILWAY_BACKEND_URL = 'https://your-app-name.up.railway.app';

// Set environment to 'production' for Railway, or 'development' for local testing
const ENVIRONMENT = 'production';
```

**Important**: Replace `https://your-app-name.up.railway.app` with your actual Railway backend URL.

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `node server.js`
6. Add Environment Variables:
   ```
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=<your-random-secret>
   FRONTEND_URL=https://your-frontend-url.com
   CORS_ORIGIN=https://your-frontend-url.com
   ```
7. Copy your Railway backend URL (e.g., `https://your-app-name.up.railway.app`)

### Step 3: Update Config with Railway URL

1. Open `js/config.js`
2. Replace `https://your-app-name.up.railway.app` with your actual Railway URL
3. Set `ENVIRONMENT = 'production'`

### Step 4: Deploy Frontend

**Option A: Railway Static Site**
- Create a new service in Railway
- Select "Static Site"
- Point to your repository root

**Option B: Vercel/Netlify**
- Deploy frontend separately
- Update CORS_ORIGIN in backend environment variables

### Step 5: Update Backend Environment Variables

In Railway backend service, update:
- `FRONTEND_URL`: Your frontend deployment URL
- `CORS_ORIGIN`: Your frontend deployment URL (comma-separated if multiple)

## 🔄 Switching Between Local and Railway

### For Local Development:
Edit `js/config.js`:
```javascript
const ENVIRONMENT = 'development';
```

### For Railway/Production:
Edit `js/config.js`:
```javascript
const ENVIRONMENT = 'production';
const RAILWAY_BACKEND_URL = 'https://your-actual-railway-url.up.railway.app';
```

## 📝 Files Modified

- ✅ `js/config.js` - New configuration file
- ✅ `js/api.js` - Updated to use config
- ✅ `backend/public/js/api.js` - Updated to use config
- ✅ `backend/server.js` - Updated to use environment variables
- ✅ `index.html` - Updated all fetch calls to use config

## 🧪 Testing

1. **Test Backend Health**:
   ```bash
   curl https://your-railway-url.up.railway.app/health
   ```

2. **Test API Endpoint**:
   ```bash
   curl https://your-railway-url.up.railway.app/api/courses
   ```

3. **Test Frontend**:
   - Open your frontend URL
   - Open browser DevTools (F12)
   - Check Console for API calls
   - Verify they're going to Railway URL, not localhost

## 🐛 Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in Railway includes your frontend URL
- Check for trailing slashes in URLs

### API Not Found
- Verify Railway URL is correct in `js/config.js`
- Check Railway logs for errors
- Ensure backend is deployed and running

### Still Using Localhost
- Clear browser cache
- Check that `js/config.js` is loaded before `js/api.js`
- Verify `ENVIRONMENT` is set to `'production'`

## 📞 Quick Reference

- **Config File**: `js/config.js`
- **Railway Dashboard**: https://railway.app/dashboard
- **Backend Health Check**: `https://your-railway-url.up.railway.app/health`

---

**Note**: After updating the Railway URL in `js/config.js`, commit and push your changes so the frontend uses the correct URL.


