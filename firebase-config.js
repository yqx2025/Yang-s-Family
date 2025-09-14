// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj7oel9oxDn_ehVoHQK6VspLk6QOgrGhM",
  authDomain: "real-207a1.firebaseapp.com",
  projectId: "real-207a1",
  storageBucket: "real-207a1.firebasestorage.app",
  messagingSenderId: "515418801001",
  appId: "1:515418801001:web:ef0ff22d8e1e584b6b73f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance for use in other files
export default app;
