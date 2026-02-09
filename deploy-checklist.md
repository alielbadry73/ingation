# Pre-Deployment Checklist

Use this checklist before deploying your application.

## ✅ Pre-Deployment Steps

### 1. Environment Setup
- [ ] Create `.env` file in `backend/` directory (copy from `.env.example`)
- [ ] Generate a strong JWT_SECRET (use `openssl rand -hex 32`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` with your frontend domain(s)
- [ ] Update `FRONTEND_URL` with your production frontend URL

### 2. Code Updates
- [ ] Update all API URLs from `localhost:3000` to production URL
  - Run: `node update-api-urls.js https://your-backend-url.com`
- [ ] Test backend locally with production environment variables
- [ ] Verify all API endpoints work correctly
- [ ] Check for hardcoded URLs in JavaScript files

### 3. Security
- [ ] Change default JWT_SECRET
- [ ] Review CORS settings (don't use `*` in production)
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Remove any console.log statements with sensitive data
- [ ] Verify rate limiting is enabled

### 4. Database
- [ ] Backup existing database (if any)
- [ ] Test database connection
- [ ] Consider migrating to PostgreSQL for production (optional)
- [ ] Verify database file is in `.gitignore`

### 5. Dependencies
- [ ] Run `npm install` in `backend/` directory
- [ ] Verify all dependencies are in `package.json`
- [ ] Remove any unused dependencies
- [ ] Check for security vulnerabilities: `npm audit`

### 6. File Structure
- [ ] Ensure `uploads/` directory exists (or will be created)
- [ ] Verify static file serving is configured
- [ ] Check that all required directories exist

### 7. Testing
- [ ] Test login functionality
- [ ] Test API endpoints with Postman/curl
- [ ] Test file uploads (if applicable)
- [ ] Test CORS with frontend
- [ ] Test error handling

### 8. Git
- [ ] Commit all changes
- [ ] Push to GitHub/GitLab
- [ ] Verify `.env` is NOT committed
- [ ] Create a release tag (optional)

### 9. Deployment Platform Setup
- [ ] Create account on deployment platform (Render/Railway/Vercel)
- [ ] Connect GitHub repository
- [ ] Configure environment variables in platform
- [ ] Set build and start commands
- [ ] Configure root directory (if needed)

### 10. Post-Deployment
- [ ] Test backend health endpoint: `https://your-backend.com/health`
- [ ] Test API endpoint: `https://your-backend.com/api/courses`
- [ ] Verify frontend can connect to backend
- [ ] Check browser console for errors
- [ ] Test authentication flow
- [ ] Monitor logs for errors

## 🚨 Common Issues to Check

- **CORS Errors**: Ensure backend CORS_ORIGIN includes frontend URL
- **404 Errors**: Verify API endpoint paths match exactly
- **Database Errors**: Check database file permissions and path
- **Port Errors**: Use `process.env.PORT` (already configured)
- **Environment Variables**: Double-check all variables are set in platform

## 📝 Quick Commands

```bash
# Update API URLs
node update-api-urls.js https://your-backend-url.com

# Test backend locally
cd backend
npm start

# Check for localhost references
grep -r "localhost:3000" . --exclude-dir=node_modules

# Security audit
cd backend
npm audit

# Generate JWT secret
openssl rand -hex 32
```

## 🔗 Useful Links

- Backend Health: `https://your-backend.com/health`
- API Docs: Check `BACKEND_README.md`
- Deployment Guide: See `DEPLOYMENT_GUIDE.md`


