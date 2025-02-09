// firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  enableNetwork
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

// Your Firebase configuration (replace with your actual config values)
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
export const db = getFirestore(app);

console.log("✅ Firebase Initialized:", app.name);
console.log("🔥 Firestore Project ID:", db.app.options.projectId);

// **Enable Firestore Network**
enableNetwork(db)
  .then(() => console.log("✅ Firestore network enabled"))
  .catch((err) => console.error("❌ Firestore network error:", err));

// Fetch the meal plan for the authenticated user
export const getMealPlan = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("⚠️ No authenticated user found.");
        resolve(null);
        return;
      }

      const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
      const mealPlanSnap = await getDoc(mealPlanRef);

      if (mealPlanSnap.exists()) {
        resolve(mealPlanSnap.data());
      } else {
        resolve({});
      }
    });
  });
};

// Update a specific meal in the Firestore meal plan
export const updateMealPlan = async (day: string, mealType: string, value: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("❌ No authenticated user found.");
    return;
  }

  const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
  const mealPlanSnap = await getDoc(mealPlanRef);

  let mealPlan = mealPlanSnap.exists() ? mealPlanSnap.data() : {};

  if (!mealPlan[day]) {
    mealPlan[day] = { breakfast: "", lunch: "", dinner: "" };
  }
  mealPlan[day][mealType] = value;

  await setDoc(mealPlanRef, mealPlan, { merge: true });
  console.log(`✅ Updated meal plan: ${day} - ${mealType} -> ${value}`);
};

// Listen for real-time updates to the meal plan
export const subscribeToMealPlan = (callback: (data: any) => void) => {
  let unsubscribeSnapshot = () => {};
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("⚠️ No authenticated user for meal plan updates.");
      callback({});
      return;
    }

    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");

    unsubscribeSnapshot = onSnapshot(mealPlanRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback({});
      }
    });
  });
  // Return a function that unsubscribes from both auth and snapshot listeners
  return () => {
    unsubscribeAuth();
    unsubscribeSnapshot();
  };
};

export { app };
