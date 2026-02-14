
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your specific Firebase project configuration
const firebaseConfig = {
  projectId: "studio-9054358575-f9a2a",
  appId: "1:94681048239:web:83ffe6e51461d8e613605a",
  apiKey: "AIzaSyDOuoZmdgfzUQ3EfPl6va4Xi6ih5Z6IWhc",
  authDomain: "studio-9054358575-f9a2a.firebaseapp.com",
  storageBucket: "studio-9054358575-f9a2a.appspot.com",
  messagingSenderId: "94681048239",
  measurementId: ""
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
