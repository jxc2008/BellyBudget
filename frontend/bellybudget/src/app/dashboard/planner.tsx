// planner.tsx
"use client";
import { useState } from "react";
import { BudgetProvider } from "@/contexts/BudgetContext";
import Map from "@/components/Map";
import Timeline from "@/components/Timeline";
import WeeklyCalendarButton from "@/components/WeeklyCalendarButton";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import styles from "./dashboard.module.css";

export type RestaurantSelection = {
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  estimatedCost: number;
  notes?: string;
};

export default function Planner() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantSelection | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<{ [day: string]: { breakfast: string; lunch: string; dinner: string } }>({});

  // Function to save restaurant plan to Firebase
  const saveRestaurantPlan = async (date: string, plan: RestaurantSelection) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No authenticated user found.");
      return;
    }

    const plansRef = doc(db, "users", user.uid, "restaurantPlans", "calendar");
    const plansSnap = await getDoc(plansRef);

    let plans = plansSnap.exists() ? plansSnap.data() : {};
    plans[date] = plan;

    await setDoc(plansRef, plans, { merge: true });
    console.log(`✅ Updated restaurant plan for ${date}:`, plan);
  };

  // Function to save weekly meal plan to Firebase
  const saveWeeklyMealPlan = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No authenticated user found.");
      return;
    }

    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    await setDoc(mealPlanRef, weeklyPlan, { merge: true });
    console.log("✅ Weekly meal plan saved to Firebase");
  };

  // Handler for when a restaurant is selected from the map
  const handleRestaurantSelect = async (restaurant: any) => {
    if (!restaurant) return;

    // Create a selection object
    const selection: RestaurantSelection = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date: new Date().toISOString().split("T")[0], // Default to today
      time: "12:00", // Default to noon
      estimatedCost: restaurant.price || 0,
      notes: ""
    };

    setSelectedRestaurant(selection);

    // Save to Firebase
    try {
      await saveRestaurantPlan(selection.date, selection);
      console.log("✅ Restaurant plan saved to Firebase");
    } catch (error) {
      console.error("❌ Error saving restaurant plan:", error);
    }
  };

  // Handler for updating the weekly meal plan
  const handleMealPlanChange = (day: string, mealType: string, value: string) => {
    setWeeklyPlan((prevPlan) => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: value
      }
    }));
  };

  return (
    <BudgetProvider>
      <div className={styles.plannerContainer}>
        <WeeklyCalendarButton />
        <div className={styles.plannerContent}>
          <Map onRestaurantSelect={handleRestaurantSelect} />
          <Timeline />
        </div>
        <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: "8px", marginTop: "1rem" }}>
          <h3>Weekly Meal Plan</h3>
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <div key={day} style={{ marginBottom: "0.5rem" }}>
              <h4 style={{ marginBottom: "0.25rem" }}>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
              <input
                type="text"
                placeholder="Breakfast"
                value={weeklyPlan[day]?.breakfast || ""}
                onChange={(e) => handleMealPlanChange(day, "breakfast", e.target.value)}
                style={{ marginRight: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Lunch"
                value={weeklyPlan[day]?.lunch || ""}
                onChange={(e) => handleMealPlanChange(day, "lunch", e.target.value)}
                style={{ marginRight: "0.5rem" }}
              />
              <input
                type="text"
                placeholder="Dinner"
                value={weeklyPlan[day]?.dinner || ""}
                onChange={(e) => handleMealPlanChange(day, "dinner", e.target.value)}
              />
            </div>
          ))}
          {/* Update button with inline styling to ensure visibility */}
          <button
            onClick={saveWeeklyMealPlan}
            style={{
              padding: "0.5rem 1rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "1rem",
              cursor: "pointer"
            }}
          >
            Update Weekly Meal Plan
          </button>
        </div>
      </div>
    </BudgetProvider>
  );
}
