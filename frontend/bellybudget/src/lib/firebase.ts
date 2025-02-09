import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrDqhH-CleIEm7Dc10Ea1Box_UzIIGXfs",
  authDomain: "belly-budget-bca30.firebaseapp.com",
  projectId: "belly-budget-bca30",
  storageBucket: "belly-budget-bca30.appspot.com",
  messagingSenderId: "108190463339",
  appId: "1:108190463339:web:7b5e30adfe79be96d9882e",
  measurementId: "G-TW0KZJF15Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("✅ Firebase Initialized:", app.name);
console.log("🔥 Firestore Project ID:", db.app.options.projectId);

// **Enable Firestore Network**
import { enableNetwork } from "firebase/firestore";
enableNetwork(db)
  .then(() => console.log("✅ Firestore network enabled"))
  .catch((err) => console.error("❌ Firestore network error:", err));

export { app };
