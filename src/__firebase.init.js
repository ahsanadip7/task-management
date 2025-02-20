// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaQY-dopkgZ-Kqf8m01hEqMBaKpZJcFu4",
  authDomain: "task-management-f9389.firebaseapp.com",
  projectId: "task-management-f9389",
  storageBucket: "task-management-f9389.firebasestorage.app",
  messagingSenderId: "78782740008",
  appId: "1:78782740008:web:2047a6b256196e95e8271d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)