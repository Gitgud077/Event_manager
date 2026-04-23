// auth.js - Authentication functions (signup, login, logout)
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';
import { auth, db } from './firebase.js';

// Login function
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error.code, error.message);
    return { success: false, error: error.message };
  }
}

// Signup function
export async function signup(email, password, name, role, skills = [], availability = []) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      skills: skills,
      availability: availability,
      reliabilityScore: 0
    });

    return { success: true, user: user };
  } catch (error) {
    console.error('Signup error:', error.code, error.message);
    return { success: false, error: error.message };
  }
}

// Logout function
export async function logout() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Auth state listener
export function onAuthStateChange(callback) {
  onAuthStateChanged(auth, callback);
}