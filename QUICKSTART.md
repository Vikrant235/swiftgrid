# SwiftGrid - Quick Start Guide

## What's New

SwiftGrid now has a complete Firebase authentication system with a beautiful login/signup UI and a dev-mode editor button.

## 🚀 Getting Started

### 1. Run the Dev Server
```bash
cd /vercel/share/v0-project
pnpm dev
```

The app runs at `http://localhost:3000`

### 2. Test the Landing Page
- **Homepage**: Shows "Editor (Dev)" button, "Log In", and "Sign Up" buttons
- **Click "Editor (Dev)"**: Takes you directly to `/editor` without authentication
- **Click "Log In"**: Opens login modal
- **Click "Sign Up"**: Opens signup modal

### 3. Set Up Firebase (Optional)

To enable authentication:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project
3. Enable Email/Password and Google providers
4. Get your Firebase config
5. Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
6. Restart dev server
7. Auth will work!

## 📁 File Structure

```
components/
├── auth/
│   ├── AuthModal.jsx        # Modal wrapper
│   ├── Login.jsx            # Login form (email/password + Google)
│   └── SignUp.jsx           # Signup form (email/password + Google)
├── header.tsx               # Header with auth buttons
└── ui/input.tsx             # Input component

context/
└── AuthContext.jsx          # Auth provider & useAuth hook

lib/
└── firebase.js              # Firebase initialization

app/
├── layout.tsx               # Root layout (wrapped with AuthProvider)
├── page.tsx                 # Landing page
└── editor/page.tsx          # Dev mode editor (no auth required)
```

## 🔑 Using Authentication in Components

```jsx
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <p>Hello, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## 🎯 Available Features

### Landing Page
- Hero section with feature cards
- "Go to Editor (Dev Mode)" button (no auth required)
- "Log In" and "Sign Up" buttons
- Call-to-action sections
- Footer with links

### Authentication
- Email/password login and signup
- Google OAuth
- Error handling and display
- Loading states
- Form validation
- Modal UI

### Visual Editor
- Accessible at `/editor` without authentication
- File management sidebar
- Visual CSV block representation
- Toolbar with export options

## 🛠️ Development

### Adding Auth to a Route

To protect a route with authentication:

```jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected content here</div>;
}
```

### Creating New Auth-Protected Pages

1. Create the page component
2. Use `useAuth()` hook
3. Add redirect logic if needed
4. Done!

## 📝 Documentation

- **`AUTH_SETUP.md`** - Complete setup instructions
- **`FIREBASE_AUTH_IMPLEMENTATION.md`** - Architecture details
- **`IMPLEMENTATION.md`** - Original visual editor documentation

## 🔍 File Locations

| Feature | File |
|---------|------|
| Firebase Config | `lib/firebase.js` |
| Auth Provider | `context/AuthContext.jsx` |
| Login Form | `components/auth/Login.jsx` |
| Signup Form | `components/auth/SignUp.jsx` |
| Auth Modal | `components/auth/AuthModal.jsx` |
| Header | `components/header.tsx` |
| Landing Page | `app/page.tsx` |
| Editor | `app/editor/page.tsx` |

## ✅ Features Implemented

- ✅ Landing page with prominent "Go to Editor (Dev Mode)" button
- ✅ Firebase Web Modular SDK integration
- ✅ AuthContext with useAuth hook
- ✅ Login component (email/password + Google)
- ✅ SignUp component (email/password + Google)
- ✅ AuthModal wrapper
- ✅ Updated Header with auth UI
- ✅ Error handling and loading states
- ✅ Graceful fallback for missing Firebase config
- ✅ Dev mode editor access without auth
- ✅ All components modular and reusable

## 🚫 Known Limitations (By Design)

- No backend required - fully client-side
- No email verification (can be added)
- No password reset flow (can be added)
- No user profile management (can be added)
- Firebase config required for authentication to work

## 📞 Support

See `AUTH_SETUP.md` for troubleshooting and common issues.

## 🎨 Styling

All components use:
- Tailwind CSS v4
- shadcn/ui components
- Dark theme enabled by default
- Emerald/slate color scheme

## 📦 Dependencies

- `firebase` v12.16.0 (Web Modular SDK)
- `react` v19.2.4
- `next` v16.2.11
- `tailwindcss` v4
- `lucide-react` (icons)

---

**Ready to test?** Run `pnpm dev` and visit `http://localhost:3000`! 🚀
