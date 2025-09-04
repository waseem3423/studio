// DO NOT EDIT, this file is generated
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA47JFEpNszBDHOIULsmp5wmBqQFpwxjqY",
  authDomain: "dayflow-assistant.firebaseapp.com",
  projectId: "dayflow-assistant",
  storageBucket: "dayflow-assistant.appspot.com",
  messagingSenderId: "354070895206",
  appId: "1:354070895206:web:487ff27341ee55efcdaba7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
