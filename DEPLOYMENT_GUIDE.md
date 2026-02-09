# Deployment Guide - IG Nation Learning Platform

This guide will help you deploy your project to the internet for testing the backend with frontend.

## 🚀 Quick Deployment Options

### Option 1: Render (Recommended - Free Tier Available)
**Best for:** Full-stack apps with backend + frontend

#### Steps:

1. **Prepare Your Project**
   - Ensure all dependencies are in `package.json`
   - Create a `.env` file (see Environment Variables section below)

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended) or email

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `ignation-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Port**: `3000`
   - Add Environment Variables (see below)
   - Click "Create Web Service"

4. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect your repository
   - Configure:
     - **Root Directory**: `/` (root)
     - **Build Command**: Leave empty (or `npm install` if you have build steps)
     - **Publish Directory**: `/` (root)
   - Add Environment Variables:
     - `REACT_APP_API_URL` or `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Click "Create Static Site"

5. **Update Frontend API URLs**
   - Update all API calls in your HTML/JS files to use the Render backend URL
   - Example: `http://localhost:3000` → `https://your-backend.onrender.com`

---

### Option 2: Railway (Free Tier Available)
**Best for:** Quick deployment with automatic HTTPS

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js
   - Set Root Directory to `backend`
   - Add Environment Variables
   - Railway will automatically assign a URL

3. **Deploy Frontend**
   - Create another service in the same project
   - Select "Static Site" or use a Node.js service
   - Set Root Directory to `/`
   - Configure build settings if needed

---

### Option 3: Vercel (Frontend) + Render/Railway (Backend)
**Best for:** Optimal performance with separate frontend/backend

#### Steps:

1. **Deploy Backend** (Render or Railway - see above)

2. **Deploy Frontend on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Other
     - **Root Directory**: `/`
   - Add Environment Variables
   - Deploy

---

### Option 4: Heroku (Paid, but has free alternatives)
**Note:** Heroku removed free tier, but you can use alternatives like Render or Railway

---

## 📋 Environment Variables Setup

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Secret (CHANGE THIS TO A RANDOM STRING!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-$(openssl rand -hex 32)

# Database (SQLite - file path)
# For production, consider PostgreSQL instead
DATABASE_PATH=./database.sqlite

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com,https://your-frontend-domain.vercel.app

# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Important:** 
- Generate a strong JWT_SECRET: `openssl rand -hex 32` or use an online generator
- Never commit `.env` to Git (add to `.gitignore`)

---

## 🔧 Pre-Deployment Checklist

### 1. Update CORS Configuration

Check `backend/server.js` and ensure CORS allows your frontend domain:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // In production, specify exact domains
  credentials: true
}));
```

### 2. Update Frontend API URLs

Search for all instances of `http://localhost:3000` in your frontend files and replace with your backend URL.

**Quick script to find all API calls:**
```bash
# Windows PowerShell
Get-ChildItem -Recurse -Include *.html,*.js | Select-String "localhost:3000"

# Or use grep if available
grep -r "localhost:3000" .
```

### 3. Database Considerations

**For Testing:**
- SQLite is fine for testing
- The database file will be created automatically
- **Note:** On some platforms, the file system is ephemeral (files may be lost on restart)

**For Production:**
- Consider migrating to PostgreSQL (Render/Railway offer free PostgreSQL)
- Update database connection in `server.js`

### 4. Static File Serving

Ensure your backend serves static files correctly. Check that `backend/server.js` has:

```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

### 5. Create .gitignore

Ensure `.gitignore` includes:
```
node_modules/
.env
*.sqlite
*.sqlite-journal
*.log
uploads/
.DS_Store
```

---

## 🌐 Step-by-Step: Render Deployment (Detailed)

### Backend Deployment:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Settings:
     ```
     Name: ignation-backend
     Region: Choose closest to you
     Branch: main
     Root Directory: backend
     Environment: Node
     Build Command: npm install
     Start Command: node server.js
     ```
   - Environment Variables:
     ```
     PORT=3000
     NODE_ENV=production
     JWT_SECRET=<generate-a-random-secret>
     CORS_ORIGIN=https://your-frontend.onrender.com
     ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the URL (e.g., `https://ignation-backend.onrender.com`)

3. **Update Frontend Files**
   - Replace all `http://localhost:3000` with your Render backend URL
   - Update CORS_ORIGIN in backend environment variables

4. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Settings:
     ```
     Name: ignation-frontend
     Branch: main
     Root Directory: / (root)
     Build Command: (leave empty or add if needed)
     Publish Directory: / (root)
     ```
   - Environment Variables:
     ```
     API_URL=https://ignation-backend.onrender.com
     ```
   - Click "Create Static Site"
   - Copy the frontend URL

5. **Update Backend CORS**
   - Go back to backend service
   - Update Environment Variables:
     ```
     CORS_ORIGIN=https://ignation-frontend.onrender.com
     ```
   - Redeploy backend

---

## 🔍 Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://your-backend.onrender.com/health
```

### 2. Test API Endpoint
```bash
curl https://your-backend.onrender.com/api/courses
```

### 3. Test Frontend
- Open your frontend URL in browser
- Open Developer Tools (F12)
- Check Console for errors
- Check Network tab for API calls

### 4. Common Issues

**CORS Errors:**
- Ensure backend CORS_ORIGIN includes your frontend URL
- Check for trailing slashes in URLs

**404 Errors:**
- Verify API endpoints match exactly
- Check backend logs in Render dashboard

**Database Errors:**
- SQLite may not persist on some platforms
- Consider PostgreSQL for production

**Port Errors:**
- Render/Railway assign ports automatically
- Use `process.env.PORT` in your code (already done)

---

## 📱 Alternative: Quick Testing with ngrok (Local Testing)

If you want to test without deploying, use ngrok to expose your local server:

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   # Or download from ngrok.com
   ```

2. **Start your backend locally**
   ```bash
   npm start
   ```

3. **Expose with ngrok**
   ```bash
   ngrok http 3000
   ```

4. **Use ngrok URL**
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
   - Update frontend to use this URL
   - Share with testers

**Note:** ngrok free tier has limitations (session timeout, random URLs)

---

## 🗄️ Database Migration (Optional - For Production)

If you want to use PostgreSQL instead of SQLite:

1. **Create PostgreSQL Database on Render**
   - Click "New +" → "PostgreSQL"
   - Copy connection string

2. **Install PostgreSQL Driver**
   ```bash
   cd backend
   npm install pg
   ```

3. **Update server.js**
   - Replace SQLite connection with PostgreSQL
   - Update queries to PostgreSQL syntax

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set CORS_ORIGIN to specific domains (not `*`)
- [ ] Enable HTTPS (automatic on Render/Railway/Vercel)
- [ ] Review and secure API endpoints
- [ ] Set up rate limiting (already in your code)
- [ ] Use environment variables for all secrets
- [ ] Don't commit `.env` files

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Node.js Deployment**: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

---

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file
echo "PORT=3000" > .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
echo "NODE_ENV=production" >> .env

# 3. Test locally
npm start

# 4. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 5. Deploy on Render/Railway (follow steps above)
```

---

**Good luck with your deployment! 🚀**


