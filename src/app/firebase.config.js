import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "AIzaSyCNthGOzDNGhKn-O8Dv51_ZBQL6q4LHG78",
  // authDomain: "opt-verification-phone.firebaseapp.com",
  // projectId: "opt-verification-phone",
  // storageBucket: "opt-verification-phone.appspot.com",
  // messagingSenderId: "1071703581504",
  // appId: "1:1071703581504:web:0a12dff7b6495bef3010a5",
  // measurementId: "G-TNBBB6JPW9"

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

export { auth };