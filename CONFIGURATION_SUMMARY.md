# Configuration Summary - Railway Setup

## ✅ Changes Made

Your project has been updated to use Railway instead of localhost. Here's what was changed:

### 1. Configuration Files Created
- **`js/config.js`** - Main configuration file for frontend
- **`backend/public/js/config.js`** - Configuration for backend public files

### 2. API Files Updated
- **`js/api.js`** - Now uses `window.API_CONFIG` instead of hardcoded localhost
- **`backend/public/js/api.js`** - Now uses `window.API_CONFIG` instead of hardcoded localhost

### 3. Backend Server Updated
- **`backend/server.js`** - Uses environment variables for frontend URL

### 4. HTML Files Updated
- **`index.html`** - All fetch calls now use config-based API URL
- **`backend/public/index.html`** - Added config.js script tag

## 🔧 Next Steps

### 1. Update Railway URL

Edit **`js/config.js`** and replace:
```javascript
const RAILWAY_BACKEND_URL = 'https://your-app-name.up.railway.app';
```

With your actual Railway URL (e.g., `https://ignation-backend-production.up.railway.app`)

### 2. Set Environment

In **`js/config.js`**, ensure:
```javascript
const ENVIRONMENT = 'production';
```

### 3. Deploy to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Set root directory to `backend`
5. Add environment variables (see RAILWAY_SETUP.md)
6. Copy the Railway URL and update `js/config.js`

### 4. Test

After deployment:
- Test backend: `https://your-railway-url.up.railway.app/health`
- Test API: `https://your-railway-url.up.railway.app/api/courses`
- Open frontend and check browser console - should see Railway URL in API calls

## 📝 Important Notes

- **Config must load before API**: `config.js` is loaded before `api.js` in HTML files
- **Environment variable**: Change `ENVIRONMENT` in `js/config.js` to switch between local/production
- **Backend environment**: Set `FRONTEND_URL` and `CORS_ORIGIN` in Railway environment variables

## 🔄 Switching Environments

**For Local Development:**
```javascript
// In js/config.js
const ENVIRONMENT = 'development';
```

**For Railway/Production:**
```javascript
// In js/config.js
const ENVIRONMENT = 'production';
const RAILWAY_BACKEND_URL = 'https://your-actual-url.up.railway.app';
```

## 📚 Documentation

- **Full Railway Setup**: See `RAILWAY_SETUP.md`
- **General Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Quick Deploy**: See `QUICK_DEPLOY.md`

---

**Status**: ✅ Code updated to use Railway. Just update the URL in `js/config.js` and deploy!




