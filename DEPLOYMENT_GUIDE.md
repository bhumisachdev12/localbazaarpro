# LocalBazaar Pro - Deployment Guide

This guide walks you through deploying the LocalBazaar Pro application with the backend on Render and the frontend on Netlify.

## Prerequisites

Before you begin, ensure you have:
- GitHub account (to connect repositories)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Render account (free tier available at https://render.com)
- Netlify account (free tier available at https://www.netlify.com)
- All your API credentials ready (Firebase, Cloudinary, etc.)

## Part 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas and sign up/login
2. Click **"Build a Database"**
3. Choose **"M0 Free"** tier
4. Select your preferred cloud provider and region
5. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username and strong password (save these!)
5. Set **"Database User Privileges"** to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Render to connect
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your actual database user password
6. Add your database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/localbazaar_pro`

## Part 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

If you haven't already:
```bash
cd /home/bhumi/Desktop/localbazaar_pro
git init
git add .
git commit -m "Initial commit with deployment configuration"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2.2 Create Render Web Service

1. Go to https://render.com and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name**: `localbazaar-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 2.3 Configure Environment Variables

In the Render dashboard, scroll to **"Environment Variables"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key-here` | Generate a random string (min 32 chars) |
| `FIREBASE_PROJECT_ID` | `your-project-id` | From Firebase Console |
| `FIREBASE_PRIVATE_KEY` | `your-private-key` | From Firebase service account JSON |
| `FIREBASE_CLIENT_EMAIL` | `your-client-email` | From Firebase service account JSON |
| `CLOUDINARY_CLOUD_NAME` | `du2d0ackl` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `your-api-key` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | From Cloudinary dashboard |
| `EXPO_ACCESS_TOKEN` | `your-token` | Optional, for push notifications |
| `ALLOWED_ORIGINS` | `https://your-app.netlify.app` | Will update after Netlify deployment |

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`: Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep all values secure and never commit them to Git

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy your backend
3. Wait for deployment to complete (5-10 minutes)
4. Your backend URL will be: `https://localbazaar-backend.onrender.com` (or your chosen name)

### 2.5 Verify Backend Deployment

Test the health endpoint:
```bash
curl https://your-backend-url.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T...",
  "environment": "production"
}
```

## Part 3: Deploy Frontend to Netlify

### 3.1 Update Backend URL in Render

1. Go back to your Render dashboard
2. Find your backend service
3. Go to **"Environment"** tab
4. Update `ALLOWED_ORIGINS` to include your Netlify URL (you'll get this in step 3.4)
   - Format: `https://your-app.netlify.app,http://localhost:8081`
5. Save changes (this will trigger a redeploy)

### 3.2 Create Netlify Site

1. Go to https://www.netlify.com and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build:web`
   - **Publish directory**: `frontend/web-build`
   - **Branch**: `main`

### 3.3 Configure Environment Variables

In Netlify, go to **"Site settings"** → **"Environment variables"** and add:

| Key | Value |
|-----|-------|
| `EXPO_PUBLIC_API_URL` | `https://your-backend-url.onrender.com/api` |

Replace `your-backend-url` with your actual Render backend URL.

### 3.4 Deploy

1. Click **"Deploy site"**
2. Netlify will build and deploy your frontend
3. Your site URL will be something like: `https://random-name-123.netlify.app`
4. You can customize this under **"Site settings"** → **"Change site name"**

### 3.5 Update CORS in Backend

Now that you have your Netlify URL:

1. Go back to Render dashboard
2. Update the `ALLOWED_ORIGINS` environment variable:
   ```
   https://your-app.netlify.app,http://localhost:8081,http://localhost:19006
   ```
3. Save (this will redeploy the backend)

## Part 4: Post-Deployment Verification

### 4.1 Test Backend Endpoints

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Test registration (should work)
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### 4.2 Test Frontend Application

1. Open your Netlify URL in a browser
2. Try to register a new account
3. Try to login
4. Try to create a product with image upload
5. Verify all features work correctly

### 4.3 Monitor Logs

**Render Logs:**
- Go to your Render service → **"Logs"** tab
- Watch for any errors during API calls

**Netlify Logs:**
- Go to your Netlify site → **"Deploys"** tab
- Click on the latest deploy to see build logs

## Part 5: Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Verify your connection string is correct
- Check that IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

**CORS Errors:**
- Verify `ALLOWED_ORIGINS` includes your Netlify URL
- Check that there are no trailing slashes
- Ensure the backend has redeployed after updating CORS

**Firebase Authentication Errors:**
- Verify all Firebase credentials are correctly set
- Check that private key includes newlines (use `\n` if needed)
- Ensure Firebase project is active

### Frontend Issues

**API Calls Failing:**
- Check that `EXPO_PUBLIC_API_URL` is set correctly
- Verify the URL ends with `/api`
- Check browser console for CORS errors

**Build Failures:**
- Check Netlify build logs for specific errors
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build:web`

**Images Not Uploading:**
- Verify Cloudinary credentials in backend
- Check browser network tab for upload errors
- Ensure file size is under limits

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down will be slow (30-60 seconds)
- 750 hours/month of runtime

**Netlify Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**MongoDB Atlas Free Tier:**
- 512MB storage
- Shared CPU
- No backups

## Part 6: Updating Your Deployment

### Update Backend

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render will automatically redeploy

### Update Frontend

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
3. Netlify will automatically rebuild and redeploy

## Part 7: Custom Domain (Optional)

### For Backend (Render):
1. Go to your service → **"Settings"** → **"Custom Domain"**
2. Follow instructions to add your domain
3. Update DNS records as instructed

### For Frontend (Netlify):
1. Go to **"Site settings"** → **"Domain management"**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

## Security Recommendations

1. **Use Strong Secrets**: Generate random JWT_SECRET (32+ characters)
2. **Enable HTTPS**: Both Render and Netlify provide free SSL
3. **Rotate Credentials**: Regularly update API keys and secrets
4. **Monitor Logs**: Check for suspicious activity
5. **Rate Limiting**: Consider adding rate limiting to your API
6. **Environment Variables**: Never commit secrets to Git

## Support

If you encounter issues:
- Check Render documentation: https://render.com/docs
- Check Netlify documentation: https://docs.netlify.com
- Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com

## Next Steps

- Set up monitoring and alerts
- Configure custom domains
- Set up CI/CD pipelines
- Add automated testing
- Consider upgrading to paid tiers for production use
