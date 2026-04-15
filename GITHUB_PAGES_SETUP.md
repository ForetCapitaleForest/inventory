# Quick GitHub Pages Setup Guide

Follow these steps to deploy your Tree Inventory app to GitHub Pages.

## 🚀 Quick Start (5 minutes)

### Step 1: Copy Firebase Configuration

```bash
# Copy your Firebase config to production environment
cp .env.local .env.production
```

Then edit `.env.production` - the values are already there, just verify they're correct.

### Step 2: Configure Firebase

1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication → Settings → Authorized domains**
4. Click **Add domain** and enter: `foretcapitaleforest.github.io`
5. Click **Add**

### Step 3: Enable GitHub Pages

1. Go to https://github.com/ForetCapitaleForest/inventory/settings/pages
2. Under **Source**, select:
   - **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
3. Click **Save**

### Step 4: Deploy!

**Option A: Use the setup script (Recommended)**
```bash
./deploy-setup.sh
```

**Option B: Manual deployment**
```bash
npm run deploy
```

### Step 5: Access Your App

After 1-2 minutes, visit:
**https://foretcapitaleforest.github.io/inventory/**

## 🔄 Updating Your Deployment

### Automatic (Recommended)
Just push to main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
GitHub Actions will automatically deploy!

### Manual
```bash
npm run deploy
```

## ❓ Troubleshooting

### "404 Not Found"
- Wait 1-2 minutes after first deployment
- Check GitHub Pages settings are correct
- Verify `gh-pages` branch exists in your repo

### "Blank Page"
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors
- Verify `.env.production` has correct Firebase config

### "Authentication Failed"
- Verify `foretcapitaleforest.github.io` is in Firebase authorized domains
- Check Firebase config in `.env.production`
- Make sure you're using the production Firebase project

### "Build Failed"
```bash
# Test build locally
npm run build

# Check for errors
npm run lint
```

## 📚 More Information

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed documentation.

## 🔒 Security

- ✅ Firebase config is safe to commit (protected by Firestore rules)
- ✅ Only authenticated users can access data
- ✅ API keys are restricted in Firebase Console
- ✅ `.env.local` is never committed (in .gitignore)

## 🎯 What's Deployed

- ✅ React application (static files)
- ✅ Firebase authentication
- ✅ Firestore database access
- ✅ All tree management features
- ✅ Responsive design
- ✅ PWA capabilities

Your app is production-ready! 🎉