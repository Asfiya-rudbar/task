
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB54kxDm_QPRMjW5egxqftYxHANtYA6FGc",
    authDomain: "tasktrackerapp-10302.firebaseapp.com",
    projectId: "tasktrackerapp-10302",
    storageBucket: "tasktrackerapp-10302.firebasestorage.app",
    messagingSenderId: "685129969947",
    appId: "1:685129969947:web:31182c51878a062571a3be",
    measurementId: "G-5R254T3Q3F"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth aur DB ka export
export const auth = getAuth(app);
export const db = getFirestore(app);
