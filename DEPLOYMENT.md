# GitHub Pages Deployment Guide

This guide will help you deploy the Tree Inventory application to GitHub Pages.

## Prerequisites

- GitHub repository: `https://github.com/ForetCapitaleForest/inventory`
- Firebase project configured
- Node.js and npm installed

## Step 1: Configure Production Environment

1. Copy your Firebase configuration from `.env.local` to `.env.production`:

```bash
# Open both files and copy the values
code .env.local .env.production
```

2. Replace the placeholder values in `.env.production` with your actual Firebase config:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. **Important:** Commit `.env.production` to your repository:
```bash
git add .env.production
git commit -m "Add production environment configuration"
```

> **Note:** It's safe to commit Firebase config as it's protected by Firestore security rules.

## Step 2: Configure Firebase for GitHub Pages

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication → Settings → Authorized domains**
4. Click **Add domain**
5. Add: `foretcapitaleforest.github.io`
6. Click **Add**

This allows users to authenticate from your GitHub Pages URL.

## Step 3: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/ForetCapitaleForest/inventory
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
5. Click **Save**

## Step 4: Deploy

### Option A: Manual Deployment (Recommended for first deploy)

```bash
# Install dependencies if not already installed
npm install

# Build and deploy
npm run deploy
```

This will:
1. Build the production version (`npm run build`)
2. Deploy to the `gh-pages` branch
3. GitHub Pages will automatically publish it

### Option B: Automatic Deployment with GitHub Actions

A GitHub Actions workflow is included that automatically deploys when you push to the `main` branch.

To use it:
1. The workflow file is already in `.github/workflows/deploy.yml`
2. Just push your changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
3. GitHub Actions will automatically build and deploy

## Step 5: Access Your Application

After deployment (takes 1-2 minutes), your app will be available at:

**https://foretcapitaleforest.github.io/inventory/**

## Troubleshooting

### Issue: 404 Page Not Found
- **Solution:** Wait 1-2 minutes after first deployment
- Check GitHub Pages settings are correct
- Ensure `gh-pages` branch exists

### Issue: Blank page or routing issues
- **Solution:** The `basename="/inventory"` is already configured in `App.tsx`
- Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Firebase authentication not working
- **Solution:** Verify `foretcapitaleforest.github.io` is in Firebase authorized domains
- Check `.env.production` has correct Firebase config

### Issue: Build fails
- **Solution:** Run `npm run build` locally to see errors
- Check all dependencies are installed: `npm install`
- Ensure TypeScript has no errors: `npm run lint`

## Updating the Deployment

To update your deployed app:

```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main

# Manual deploy (if not using GitHub Actions)
npm run deploy
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS with your domain provider
3. Update Firebase authorized domains with your custom domain
4. See [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Security Notes

- Firebase config in `.env.production` is safe to commit
- Firestore security rules protect your data
- Only authenticated users can read/write data
- API keys are restricted in Firebase Console

## Support

If you encounter issues:
1. Check the [GitHub Actions logs](https://github.com/ForetCapitaleForest/inventory/actions)
2. Review Firebase Console for authentication errors
3. Check browser console for client-side errors