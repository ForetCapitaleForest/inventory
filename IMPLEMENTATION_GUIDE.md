# Tree Inventory System - Implementation Guide

## Prerequisites

Before starting implementation, ensure you have:

1. **Node.js** (v18 or higher) and npm installed
2. **Git** installed and configured
3. **GitHub account** with repository created
4. **Firebase account** (free tier is sufficient to start)
5. **Code editor** (VS Code recommended)

## Step-by-Step Implementation

### Phase 1: Project Setup & Foundation

#### 1.1 Initialize React Project with Vite

```bash
# Create new Vite project with React + TypeScript
npm create vite@latest tree-inventory -- --template react-ts
cd tree-inventory
npm install

# Install core dependencies
npm install react-router-dom
npm install firebase
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query
npm install date-fns
npm install recharts
npm install leaflet react-leaflet
npm install @types/leaflet

# Install dev dependencies
npm install -D gh-pages
npm install -D @types/node
```

#### 1.2 Configure GitHub Pages Deployment

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/inventory/', // Replace with your repo name
})
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/inventory"
}
```

#### 1.3 Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "tree-inventory"
3. Enable Authentication (Email/Password and Google)
4. Create Firestore Database (start in test mode, we'll add rules later)
5. Enable Storage for photo uploads
6. Get Firebase config from Project Settings

Create `.env.local`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `src/services/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Phase 2: Authentication System

#### 2.1 Create Auth Context

Create `src/contexts/AuthContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2.2 Create Login Component

Create `src/components/auth/LoginForm.tsx`:
```typescript
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert 
} from '@mui/material';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Tree Inventory Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
```

### Phase 3: Core Data Services

#### 3.1 Create Tree Service

Create `src/services/trees.service.ts`:
```typescript
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Tree } from '../types/tree.types';

const TREES_COLLECTION = 'trees';

export const treesService = {
  async getAll(): Promise<Tree[]> {
    const q = query(collection(db, TREES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tree));
  },

  async getByStatus(status: string): Promise<Tree[]> {
    const q = query(
      collection(db, TREES_COLLECTION), 
      where('status', '==', status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tree));
  },

  async create(tree: Omit<Tree, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, TREES_COLLECTION), {
      ...tree,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Tree>): Promise<void> {
    const docRef = doc(db, TREES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, TREES_COLLECTION, id));
  },
};
```

### Phase 4: Main Application Structure

#### 4.1 Set Up Routing

Create `src/App.tsx`:
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { TreeList } from './components/trees/TreeList';
import { AppLayout } from './components/layout/AppLayout';

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#66bb6a' },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter basename="/inventory">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="trees" element={<TreeList />} />
                {/* Add more routes */}
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### Phase 5: Key Components

#### 5.1 Tree List Component

Create `src/components/trees/TreeList.tsx`:
```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  Chip,
  Button 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { treesService } from '../../services/trees.service';

export const TreeList = () => {
  const { data: trees, isLoading } = useQuery({
    queryKey: ['trees'],
    queryFn: treesService.getAll,
  });

  if (isLoading) return <div>Loading trees...</div>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Tree Inventory</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add New Tree
        </Button>
      </Box>
      <Grid container spacing={3}>
        {trees?.map((tree) => (
          <Grid item xs={12} sm={6} md={4} key={tree.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{tree.species}</Typography>
                <Typography color="text.secondary">
                  {tree.provenance}
                </Typography>
                <Box mt={2}>
                  <Chip 
                    label={tree.status} 
                    color="primary" 
                    size="small" 
                  />
                  <Chip 
                    label={tree.healthStatus} 
                    color="success" 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
```

### Phase 6: Deployment

#### 6.1 Configure Firestore Security Rules

In Firebase Console, update Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### 6.2 Deploy to GitHub Pages

```bash
# Build and deploy
npm run deploy

# Or set up GitHub Actions (see ARCHITECTURE.md)
```

#### 6.3 Configure GitHub Repository

1. Go to repository Settings → Pages
2. Source: Deploy from branch `gh-pages`
3. Wait for deployment to complete
4. Access at: `https://yourusername.github.io/inventory`

## Development Workflow

### Daily Development
```bash
# Start development server
npm run dev

# Run in separate terminal for type checking
npm run build -- --watch
```

### Before Committing
```bash
# Build to check for errors
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Common Issues & Solutions

### Issue: Firebase Authentication Not Working
- Check Firebase console authentication is enabled
- Verify `.env.local` variables are correct
- Ensure domain is authorized in Firebase console

### Issue: GitHub Pages 404 Error
- Verify `base` in `vite.config.ts` matches repo name
- Check `homepage` in `package.json` is correct
- Ensure `gh-pages` branch exists

### Issue: Firestore Permission Denied
- Update security rules in Firebase console
- Ensure user is authenticated before accessing data
- Check user has proper role/permissions

## Next Steps After Basic Setup

1. Implement remaining CRUD operations
2. Add form validation with Zod
3. Implement photo upload to Firebase Storage
4. Create dashboard with statistics
5. Add filtering and search functionality
6. Implement subcollections for measurements, maintenance, diseases
7. Add export functionality
8. Implement role-based access control
9. Add comprehensive error handling
10. Write tests

## Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Material-UI Documentation](https://mui.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)