// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSqD7wqamSq-XF9hSvTMUETxHTWvEowR4",
  authDomain: "typequest-71602.firebaseapp.com",
  projectId: "typequest-71602",
  storageBucket: "typequest-71602.appspot.com",
  messagingSenderId: "928080190460",
  appId: "1:928080190460:web:cf24ce9bad3b00383cf079",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
