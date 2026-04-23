// role.js - Role-based redirection logic
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js';
import { db } from './firebase.js';

// Function to get user role from Firestore
export async function getUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    } else {
      throw new Error('User document not found');
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Function to redirect based on role
export function redirectBasedOnRole(role) {
  if (role === 'eventManager') {
    window.location.href = 'manager.html';
  } else if (role === 'volunteer') {
    window.location.href = 'volunteer.html';
  } else {
    console.error('Unknown role:', role);
  }
}

// Function to handle post-login redirection
export async function handlePostLogin(user) {
  const role = await getUserRole(user.uid);
  if (role) {
    redirectBasedOnRole(role);
  } else {
    // Handle error, perhaps redirect to login
    window.location.href = 'index.html';
  }
}