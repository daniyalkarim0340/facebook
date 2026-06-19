import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and export it
export const storage = getStorage(app);