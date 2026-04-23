// firebase.js - Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDIhgmXywH5F186bF671OgIGPx-5JXHX_Y",
  authDomain: "volunteerrecruit-35c22.firebaseapp.com",
  projectId: "volunteerrecruit-35c22",
  storageBucket: "volunteerrecruit-35c22.firebasestorage.app",
  messagingSenderId: "395726784849",
  appId: "1:395726784849:web:bd538fc59142feac7eab70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);