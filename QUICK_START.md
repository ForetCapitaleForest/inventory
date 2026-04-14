# Quick Start Guide - Tree Inventory System

## 🚀 Get Up and Running in 30 Minutes

### Prerequisites Checklist
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] GitHub account created
- [ ] Firebase account created (free tier)
- [ ] Code editor installed (VS Code recommended)

## Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "tree-inventory"
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Firebase Services

**Authentication:**
1. Click "Authentication" → "Get started"
2. Enable "Email/Password"
3. Enable "Google" (optional)

**Firestore Database:**
1. Click "Firestore Database" → "Create database"
2. Start in "Test mode"
3. Choose location closest to you
4. Click "Enable"

**Storage:**
1. Click "Storage" → "Get started"
2. Start in "Test mode"
3. Click "Done"

### Get Firebase Config

1. Click gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app: "tree-inventory-web"
5. Copy the config object (you'll need this later)

## Step 2: Set Up Local Project (10 minutes)

```bash
# Create project with Vite
npm create vite@latest tree-inventory -- --template react-ts
cd tree-inventory

# Install all dependencies
npm install react-router-dom firebase @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form zod @hookform/resolvers @tanstack/react-query date-fns recharts leaflet react-leaflet @types/leaflet

# Install dev dependencies
npm install -D gh-pages @types/node

# Create environment file
touch .env.local
```

### Configure .env.local

Open `.env.local` and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Update package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_GITHUB_USERNAME.github.io/inventory"
}
```

### Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/inventory/', // Match your repo name
})
```

## Step 3: Create GitHub Repository (5 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub (via web interface)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/inventory.git
git branch -M main
git push -u origin main
```

## Step 4: Start Development (5 minutes)

```bash
# Start dev server
npm run dev
```

Visit http://localhost:5173 to see your app!

## Step 5: Deploy to GitHub Pages (5 minutes)

```bash
# Build and deploy
npm run deploy
```

### Enable GitHub Pages

1. Go to your repo on GitHub
2. Settings → Pages
3. Source: "Deploy from a branch"
4. Branch: "gh-pages" → "/ (root)"
5. Save

Wait 2-3 minutes, then visit:
`https://YOUR_USERNAME.github.io/inventory`

## 📋 Development Workflow

### Daily Development

```bash
# Start dev server
npm run dev

# In another terminal, watch for type errors
npm run build -- --watch
```

### Before Committing

```bash
# Check for build errors
npm run build

# Commit changes
git add .
git commit -m "Your commit message"
git push
```

### Deploy Updates

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🎯 Implementation Order

Follow this order for best results:

### Week 1: Foundation
- [ ] Set up Firebase service (`src/services/firebase.ts`)
- [ ] Create Auth context (`src/contexts/AuthContext.tsx`)
- [ ] Build login form (`src/components/auth/LoginForm.tsx`)
- [ ] Set up routing (`src/App.tsx`)
- [ ] Create basic layout (`src/components/layout/AppLayout.tsx`)

### Week 2: Core Features
- [ ] Define TypeScript types (`src/types/tree.types.ts`)
- [ ] Create tree service (`src/services/trees.service.ts`)
- [ ] Build tree list view (`src/components/trees/TreeList.tsx`)
- [ ] Create tree form (`src/components/trees/TreeForm.tsx`)
- [ ] Add tree detail view (`src/components/trees/TreeDetail.tsx`)

### Week 3-4: Enhanced Features
- [ ] Add photo upload functionality
- [ ] Implement growth measurements
- [ ] Create maintenance tracking
- [ ] Build disease monitoring
- [ ] Add supplier management

### Week 5-6: Advanced Features
- [ ] Create dashboard with charts
- [ ] Implement filtering and search
- [ ] Add location management with maps
- [ ] Build export functionality
- [ ] Implement role-based access

### Week 7-8: Polish & Deploy
- [ ] Add error handling
- [ ] Implement loading states
- [ ] Make responsive for mobile
- [ ] Write tests
- [ ] Update Firestore security rules
- [ ] Final deployment

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
npm run deploy          # Deploy to GitHub Pages

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub

# Troubleshooting
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies
rm -rf dist             # Remove build folder
```

## 🐛 Troubleshooting

### "Firebase not initialized"
- Check `.env.local` exists and has correct values
- Restart dev server after creating `.env.local`

### "Permission denied" in Firestore
- Update security rules in Firebase Console
- Ensure user is logged in

### GitHub Pages shows 404
- Check `base` in `vite.config.ts` matches repo name
- Verify `homepage` in `package.json` is correct
- Wait 2-3 minutes after deployment

### Build fails
- Run `npm run build` to see detailed errors
- Check TypeScript errors
- Ensure all imports are correct

## 📚 File Structure Reference

```
tree-inventory/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, signup
│   │   ├── layout/         # App layout, header, sidebar
│   │   ├── trees/          # Tree list, form, detail
│   │   ├── dashboard/      # Dashboard and charts
│   │   └── common/         # Reusable components
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication state
│   ├── services/
│   │   ├── firebase.ts     # Firebase initialization
│   │   └── trees.service.ts # Tree CRUD operations
│   ├── types/
│   │   └── tree.types.ts   # TypeScript interfaces
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── .env.local              # Firebase config (DO NOT COMMIT)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎓 Learning Resources

### Essential Reading
- [React Docs](https://react.dev/learn) - Learn React fundamentals
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - TypeScript basics
- [Firebase Web Guide](https://firebase.google.com/docs/web/setup) - Firebase setup

### Video Tutorials
- [React Tutorial for Beginners](https://www.youtube.com/watch?v=SqcY0GlETPk) - Programming with Mosh
- [Firebase Crash Course](https://www.youtube.com/watch?v=q5J5ho7YUhA) - Traversy Media
- [Material-UI Tutorial](https://www.youtube.com/watch?v=vyJU9efvUtQ) - Codevolution

### Documentation
- [Material-UI Components](https://mui.com/material-ui/getting-started/) - UI components
- [React Query Guide](https://tanstack.com/query/latest/docs/react/overview) - Data fetching
- [React Hook Form](https://react-hook-form.com/get-started) - Form handling

## ✅ Success Checklist

Before considering the project complete:

- [ ] Users can register and log in
- [ ] Trees can be created with all required fields
- [ ] Trees can be viewed in a list
- [ ] Tree details can be viewed
- [ ] Trees can be edited
- [ ] Trees can be deleted
- [ ] Photos can be uploaded
- [ ] Status workflow works (Supplier → Nursery → Planted)
- [ ] Health status can be updated
- [ ] Dashboard shows statistics
- [ ] Application is responsive on mobile
- [ ] Application is deployed to GitHub Pages
- [ ] Firestore security rules are configured
- [ ] Error handling works properly
- [ ] Loading states are shown

## 🎉 Next Steps After Basic Setup

1. Review the detailed [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) step-by-step
3. Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for overview
4. Track progress with the todo list
5. Start coding!

## 💬 Need Help?

- Check the troubleshooting section above
- Review the implementation guide
- Consult the architecture document
- Search Firebase/React documentation
- Ask in relevant Discord/Slack communities

---

**Remember**: Start small, test often, commit frequently!

Good luck building your Tree Inventory System! 🌳