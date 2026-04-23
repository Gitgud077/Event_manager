// firebase.js - Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';

// Firebase configuration
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
console.log('Firebase app initialized:', app.name);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
console.log('Auth and Firestore initialized');

// Set persistence for auth
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});