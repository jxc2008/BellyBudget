// WeeklyCalendarOverlay.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./WeeklyCalendarOverlay.module.css";

import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, updateDoc, deleteField } from "firebase/firestore";

// Helper to format a meal value for display
const formatMealValue = (val: any): string => {
  if (typeof val === "object" && val !== null) {
    return `${val.name} (${val.rating}★) - $${val.estimated_cost ? val.estimated_cost.toFixed(2) : "N/A"}`;
  }
  return val || "";
};

interface WeeklyCalendarOverlayProps {
  onClose: () => void;
}

export default function WeeklyCalendarOverlay({ onClose }: WeeklyCalendarOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);
  // localWeeklyPlan reflects the current meal plan data from Firebase.
  const [localWeeklyPlan, setLocalWeeklyPlan] = useState<any>({});
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Days and meal types (used for iterating over the week)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["breakfast", "lunch", "dinner"];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Close the overlay when clicking outside it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subscribe to the meal plan from Firebase so the overlay always shows the latest data.
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    const unsubscribe = onSnapshot(mealPlanRef, (docSnap) => {
      if (docSnap.exists()) {
        setLocalWeeklyPlan(docSnap.data());
      } else {
        setLocalWeeklyPlan({});
      }
    });
    return () => unsubscribe();
  }, []);

  // Save (or update) the weekly meal plan to Firebase.
  const saveWeeklyMealPlanToFirebase = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No authenticated user found.");
      return;
    }
    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    try {
      await setDoc(mealPlanRef, localWeeklyPlan, { merge: true });
      console.log("✅ Weekly meal plan saved to Firebase");
    } catch (error) {
      console.error("❌ Error saving weekly meal plan:", error);
    }
  };

  // Remove a single meal entry (for a given day and meal type) using deleteField so that it is removed from Firebase.
  const handleRemoveWeeklyMeal = async (day: string, mealType: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    try {
      await updateDoc(mealPlanRef, { [`${day.toLowerCase()}.${mealType}`]: deleteField() });
      console.log(`Removed ${mealType} plan for ${day}`);
    } catch (error) {
      console.error(`Error removing ${mealType} plan for ${day}:`, error);
    }
  };

  // Remove all events for the week by deleting every meal field in every day.
  const handleRemoveAllWeeklyMeals = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    try {
      const updates: { [key: string]: any } = {};
      days.forEach(day => {
        mealTypes.forEach(mealType => {
          updates[`${day.toLowerCase()}.${mealType}`] = deleteField();
        });
      });
      await updateDoc(mealPlanRef, updates);
      console.log("Removed all weekly events successfully");
    } catch (error) {
      console.error("Error removing all weekly events:", error);
    }
  };

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}>
      <div className={`${styles.calendar} ${isClosing ? styles.closing : ""}`} ref={overlayRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>Weekly Meal Plan</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close calendar">
            <X size={24} />
          </button>
        </div>

        {days.map((day) => (
          <div key={day} className={styles.day}>
            <div className={styles.dayHeader}>
              <h3>{day}</h3>
            </div>
            {mealTypes.map((mealType) => (
              <div key={`${day}-${mealType}`} className={styles.meal}>
                <label className={styles.mealLabel}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </label>
                <input
                  type="text"
                  className={styles.mealInput}
                  value={
                    localWeeklyPlan[day.toLowerCase()]
                      ? formatMealValue(localWeeklyPlan[day.toLowerCase()][mealType])
                      : ""
                  }
                  onChange={(e) => {
                    const user = auth.currentUser;
                    if (!user) return;
                    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
                    // Update the field value in Firebase.
                    const field = `${day.toLowerCase()}.${mealType}`;
                    updateDoc(mealPlanRef, { [field]: e.target.value }).catch((error) => {
                      console.error("Error updating meal plan:", error);
                    });
                  }}
                  placeholder={`Enter ${mealType} plan`}
                />
                {localWeeklyPlan[day.toLowerCase()] &&
                  localWeeklyPlan[day.toLowerCase()][mealType] && (
                    <button
                      onClick={() => handleRemoveWeeklyMeal(day, mealType)}
                      className={styles.removeButton}
                      aria-label={`Remove ${mealType} plan for ${day}`}
                    >
                      Remove
                    </button>
                  )}
              </div>
            ))}
          </div>
        ))}

        <div className={styles.buttonRow}>
          <button className={styles.saveButton} onClick={saveWeeklyMealPlanToFirebase}>
            Save Weekly Meal Plan
          </button>
          <button className={styles.removeAllButton} onClick={handleRemoveAllWeeklyMeals}>
            Remove All
          </button>
        </div>
      </div>
    </div>
  );
}
