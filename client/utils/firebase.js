// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "igrisai-881c3.firebaseapp.com",
  projectId: "igrisai-881c3",
  storageBucket: "igrisai-881c3.firebasestorage.app",
  messagingSenderId: "78154562762",
  appId: "1:78154562762:web:d2e76fe49823a19942c833"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()