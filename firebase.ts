// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSPMLoSZBPFF5L0JXHB6EZwecGXHBLSK8",
  authDomain: "app-fuel-tracker.firebaseapp.com",
  projectId: "app-fuel-tracker",
  storageBucket: "app-fuel-tracker.firebasestorage.app",
  messagingSenderId: "49883010894",
  appId: "1:49883010894:web:83bd90277801f8d89e701f"
};

// Initialize Firebase, ensuring it's a singleton
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export auth instance by getting it from the explicit app instance
export const auth = getAuth(app);

// Export Firestore instance
export const db = getFirestore(app);
