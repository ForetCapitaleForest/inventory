#!/bin/bash

# GitHub Pages Deployment Setup Script
# This script helps you set up and deploy to GitHub Pages

echo "🌲 Tree Inventory - GitHub Pages Deployment Setup"
echo "=================================================="
echo ""

# Note: .env.production is no longer needed for deployment
# Firebase credentials are now stored in GitHub Secrets
echo "ℹ️  Firebase credentials will be loaded from GitHub Secrets during deployment"
echo ""

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
    echo "✅ gh-pages installed"
    echo ""
fi

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Commit them before deploying:"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    else
        echo "⚠️  Skipping commit. Remember to commit before deploying!"
    fi
    echo ""
fi

echo "🔧 Deployment Checklist:"
echo "========================"
echo ""
echo "Before deploying, make sure you've done the following:"
echo ""
echo "1. 🔐 GitHub Secrets Setup"
echo "   - Go to: https://github.com/ForetCapitaleForest/inventory/settings/secrets/actions"
echo "   - Add all VITE_FIREBASE_* secrets with your Firebase config"
echo ""
echo "2. 🔐 Firebase Console Setup"
echo "   - Go to: https://console.firebase.google.com"
echo "   - Authentication → Settings → Authorized domains"
echo "   - Add: foretcapitaleforest.github.io"
echo ""
echo "3. ⚙️  GitHub Pages Settings"
echo "   - Go to: https://github.com/ForetCapitaleForest/inventory/settings/pages"
echo "   - Source: Deploy from a branch"
echo "   - Branch: gh-pages / (root)"
echo ""
read -p "Have you completed all the above steps? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "⚠️  Please complete the checklist before deploying."
    echo "See DEPLOYMENT.md for detailed instructions."
    exit 1
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Build and deploy
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Your app will be available at:"
    echo "   https://foretcapitaleforest.github.io/inventory/"
    echo ""
    echo "⏱️  It may take 1-2 minutes for changes to appear."
    echo ""
    echo "📚 For more information, see DEPLOYMENT.md"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Check the error messages above."
    echo "See DEPLOYMENT.md for troubleshooting."
    exit 1
fi

# Made with Bob
