# 🚀 Quick Deployment Guide

## Fastest Way to Deploy (5 minutes)

### Step 1: Prepare Your Code

1. **Create environment file** (in `backend/` directory):
   ```bash
   cd backend
   # Create .env file with:
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=<generate-random-string>
   CORS_ORIGIN=*
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

### Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ignation-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `<your-random-secret>`
   - `CORS_ORIGIN` = `*` (or your frontend URL)
6. Click **"Create Web Service"**
7. Wait 5-10 minutes, then copy your backend URL (e.g., `https://ignation-backend.onrender.com`)

### Step 3: Update Frontend URLs

Run this script to update all API URLs:
```bash
node update-api-urls.js https://your-backend-url.onrender.com
```

Or manually search and replace:
- Find: `http://localhost:3000`
- Replace: `https://your-backend-url.onrender.com`

### Step 4: Deploy Frontend

**Option A: Render Static Site**
1. On Render, click **"New +"** → **"Static Site"**
2. Connect same repository
3. Root Directory: `/` (root)
4. Publish Directory: `/` (root)
5. Click **"Create Static Site"**

**Option B: Vercel (Recommended for Frontend)**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your repository
4. Framework: **Other**
5. Deploy

### Step 5: Update CORS

1. Go back to Render backend service
2. Update Environment Variable:
   - `CORS_ORIGIN` = `https://your-frontend-url.com`
3. Redeploy backend

### Step 6: Test

1. Open your frontend URL
2. Open browser DevTools (F12)
3. Check Console for errors
4. Test login/API calls

## 🎯 That's It!

Your app should now be live! 

**Backend URL**: `https://your-backend.onrender.com`  
**Frontend URL**: `https://your-frontend.vercel.app` (or Render)

## 🔧 Troubleshooting

**CORS Error?**
- Update `CORS_ORIGIN` in backend environment variables
- Include exact frontend URL (no trailing slash)

**404 on API?**
- Check backend URL is correct
- Verify API endpoint paths

**Database Error?**
- SQLite works for testing
- For production, consider PostgreSQL

**Need Help?**
- See full guide: `DEPLOYMENT_GUIDE.md`
- Check logs in Render dashboard


