import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase Config (Replace with the values from your Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBrDqhH-CleIEm7Dc10Ea1Box_UzIIGXfs",
  authDomain: "belly-budget-bca30.firebaseapp.com",
  projectId: "belly-budget-bca30",
  storageBucket: "belly-budget-bca30.appspot.com",
  messagingSenderId: "108190463339",
  appId: "1:108190463339:web:7b5e30adfe79be96d9882e",
  measurementId: "G-TW0KZJF15Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
