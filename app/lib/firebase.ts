// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS OBJECT WITH YOUR OWN KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDGGh0YuPsEArVycRMRpt5M8ZdqFH88Bl4",
  authDomain: "ru-study-hub.firebaseapp.com",
  projectId: "ru-study-hub",
  storageBucket: "ru-study-hub.firebasestorage.app",
  messagingSenderId: "795803060128",
  appId: "1:795803060128:web:f71803620b9a55d7b286c5"
};

// Singleton pattern to prevent initializing twice
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);