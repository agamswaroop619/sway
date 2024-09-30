import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDPHa3zqk3Wp-7hby7tdj7vQS_63gDc23c",
  authDomain: "otp-ver-30605.firebaseapp.com",
  projectId: "otp-ver-30605",
  storageBucket: "otp-ver-30605.appspot.com",
  messagingSenderId: "947884737461",
  appId: "1:947884737461:web:70598d9a5ce9aa17d88ffc",
  measurementId: "G-JKJF0P4YW8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

const firestore = getFirestore(app);

export { auth, firestore, app };