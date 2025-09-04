// DO NOT EDIT, this file is generated
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "apiKey": "api-key",
  "authDomain": "dev-project-name.firebaseapp.com",
  "projectId": "dev-project-name",
  "storageBucket": "dev-project-name.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
