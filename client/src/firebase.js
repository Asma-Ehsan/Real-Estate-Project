// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_API_KEY,
  authDomain: "mern-state-19f2f.firebaseapp.com",
  projectId: "mern-state-19f2f",
  storageBucket: "mern-state-19f2f.firebasestorage.app",
  messagingSenderId: "1074086148219",
  appId: "1:1074086148219:web:50c8e6db97a80caf90cade"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);