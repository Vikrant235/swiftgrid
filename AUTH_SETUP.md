# Firebase Authentication Setup Guide

## Overview

SwiftGrid now includes a complete Firebase authentication system with email/password and Google OAuth support. All authentication logic is client-side using the Firebase Web Modular SDK.

## Architecture

### Modular Components

1. **`lib/firebase.js`** - Firebase initialization
   - Initializes Firebase app and auth instance
   - Reads config from environment variables
   - Handles initialization errors gracefully

2. **`context/AuthContext.jsx`** - Authentication state management
   - Provides `useAuth()` hook for components
   - Tracks user session with `onAuthStateChanged`
   - Exports auth functions: `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithGoogle`, `signOut`
   - Manages error and loading states

3. **`components/auth/Login.jsx`** - Login form UI
   - Email and password inputs
   - Google sign-in button
   - Loading states and error messages
   - Link to switch to signup

4. **`components/auth/SignUp.jsx`** - Signup form UI
   - Email, password, and confirm password inputs
   - Password validation (min 6 characters, must match)
   - Google sign-up button
   - Error handling and display
   - Link to switch to login

5. **`components/auth/AuthModal.jsx`** - Modal wrapper
   - Manages showing/hiding auth forms
   - Handles switching between login and signup modes
   - Modal overlay with close button

6. **`components/header.tsx`** - Navigation header
   - "Go to Editor (Dev Mode)" button that routes to `/editor` without auth
   - Log In / Sign Up buttons that open AuthModal
   - User menu when logged in

## Setup Instructions

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** service
4. Enable **Email/Password** provider
5. Enable **Google** provider
6. Get your project credentials

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

All these values are found in your Firebase Console under **Project Settings**.

### Step 3: (For Google OAuth) Configure OAuth Consent Screen

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your domain to the list

For local development, `localhost` should already be configured.

## Usage in Components

### Using the `useAuth` Hook

```jsx
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, loading, error, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <div>Not signed in</div>;
}
```

### Available Auth Functions

```jsx
const {
  user,              // Current user object or null
  loading,           // Loading state boolean
  error,             // Error message string or null
  signInWithEmailAndPassword,    // (email, password) => Promise<user>
  createUserWithEmailAndPassword,// (email, password) => Promise<user>
  signInWithGoogle,              // () => Promise<user>
  signOut,                       // () => Promise<void>
} = useAuth();
```

## Features

### Email/Password Authentication
- Input validation
- Loading states with spinners
- Error message display
- Password strength requirements (6+ characters)
- Confirm password matching

### Google OAuth
- One-click sign-in/signup
- Automatic account creation
- Consistent styling with email auth

### User Session
- Automatic session tracking on app load
- Persistent login across page refreshes
- Session state management

### Error Handling
- Firebase API error messages displayed to users
- Graceful handling of missing Firebase config
- Console warnings for setup issues

## Dev Mode Editor Access

The "Go to Editor (Dev Mode)" button in the header provides **unauthenticated access** to `/editor` for development and testing purposes. This does not require login.

To make the editor protected, wrap it with an auth guard:

```jsx
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <Editor />;
}
```

## Testing Authentication

### Local Development
1. Run `pnpm dev`
2. Click "Log In" or "Sign Up" in the header
3. For email/password: Enter any email and password (6+ chars)
4. For Google: Click the Google button (requires Google account)

### Test Users
- Any email can be used with any password
- Accounts are created automatically on first signup
- Test with your own email for real Firebase integration

## Next Steps

1. **Configure Firebase** - Add your project credentials to `.env.local`
2. **Test Auth** - Create test accounts and verify sign-in/up flows
3. **Protect Routes** - Add `useAuth` checks to pages that need authentication
4. **User Profile** - Extend with user profile data (displayName, photoURL, etc.)
5. **Persistence** - Auth state persists automatically via Firebase SDK

## Troubleshooting

### "Firebase is not configured"
- Check `.env.local` has all required `NEXT_PUBLIC_FIREBASE_*` variables
- Restart dev server after adding env variables
- Verify variables are correctly copied from Firebase Console

### Google OAuth not working
- Ensure Google provider is enabled in Firebase Console
- Check OAuth consent screen is configured
- Verify domain is in authorized domains list

### Build errors with Firebase
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Restart dev server

## Security Notes

- All Firebase configuration uses `NEXT_PUBLIC_*` prefix (safe for client-side)
- Do NOT expose Firebase private keys in environment variables
- Auth state is managed securely by Firebase SDK
- Sessions are validated server-side by Firebase
