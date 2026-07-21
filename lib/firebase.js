import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// Replace these placeholder values with your Firebase project credentials from Firebase Console
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgeNwPAav-3PsRx7QyHjzlqms4vl_DDHE",
  authDomain: "swiftgrid-csv.firebaseapp.com",
  projectId: "swiftgrid-csv",
  storageBucket: "swiftgrid-csv.firebasestorage.app",
  messagingSenderId: "109409947543",
  appId: "1:109409947543:web:dd1b3b23328b0ac1083ed2"
};

// Initialize Firebase only if config is available
let app;
let auth;

try {
  // Check if we have at least the apiKey to proceed
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    console.warn(
      '[Firebase] Configuration not found. Please add Firebase environment variables to .env.local\n' +
      'Required variables: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc.'
    );
  }
} catch (error) {
  console.error('[Firebase] Failed to initialize:', error);
}

export { app, auth };
export default app;
