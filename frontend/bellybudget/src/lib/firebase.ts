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

export const insertMealPlan = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("⚠️ No authenticated user found.");
        resolve(null);
        return;
      }

      try {
        // Step 1: Fetch restaurant data from /schedule
        const response = await fetch("http://localhost:3001/schedule");
        const restaurants = await response.json();

        // Log response to debug
        console.log("📌 Restaurant API Response:", restaurants);

        if (!Array.isArray(restaurants) || restaurants.length === 0) {
          console.error("❌ No valid restaurant data received.");
          resolve(null);
          return;
        }

        // Step 2: Fetch existing meal plan from Firestore
        const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
        const mealPlanSnap = await getDoc(mealPlanRef);

        let mealPlan = mealPlanSnap.exists() ? mealPlanSnap.data() : {};

        // Define days and meal slots
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const mealTypes = ["breakfast", "lunch", "dinner"];

        // Step 3: Assign restaurants to meal slots
        let restaurantIndex = 0;

        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          mealPlan[day] = mealPlan[day] || {}; // Ensure the day exists

          for (let j = 0; j < mealTypes.length; j++) {
            const mealType = mealTypes[j];
            const restaurant = restaurants[restaurantIndex % restaurants.length]; // Rotate through restaurants

            // Ensure we're not inserting "Soup" or "French Toast" as defaults
            if (restaurant && restaurant.name) {
              mealPlan[day][mealType] = {
                name: restaurant.name,
                address: restaurant.vicinity,
                price_level: restaurant.price_level,
                rating: restaurant.rating,
                estimated_cost: restaurant.estimated_cost,
              };
            } else {
              console.warn(`⚠️ Skipping meal assignment for ${day} ${mealType} due to missing restaurant data.`);
            }

            restaurantIndex++; // Move to the next restaurant
          }
        }

        // Log final meal plan before saving to Firestore
        console.log("📌 Final Meal Plan Before Firestore:", mealPlan);

        // Step 4: Save meal plan to Firestore
        await setDoc(mealPlanRef, mealPlan, { merge: true });

        console.log("✅ Meal plan inserted successfully!");
        resolve(mealPlan);
      } catch (error) {
        console.error("❌ Error inserting meal plan:", error);
        reject(error);
      }
    });
  });
};

insertMealPlan().then((data) => console.log("Meal plan inserted:", data));
export { app };
