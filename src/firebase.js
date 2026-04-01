import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKuOlaHFLsjqy2T0kJuX9_DV5G9JALH2E",
  authDomain: "motriva-database.firebaseapp.com",
  projectId: "motriva-database",
  storageBucket: "motriva-database.firebasestorage.app",
  messagingSenderId: "454934138405",
  appId: "1:454934138405:web:77769d65d78425bf3af9cc",
  measurementId: "G-NS38B5XXY8"
};

// Intentionally ignoring duplicate app initialization errors locally
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', error.stack);
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
