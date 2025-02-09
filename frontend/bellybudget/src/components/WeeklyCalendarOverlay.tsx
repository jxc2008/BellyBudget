// WeeklyCalendarOverlay.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useBudget } from "@/contexts/BudgetContext";
import styles from "./WeeklyCalendarOverlay.module.css";

// Import Firebase and Firestore methods
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface WeeklyCalendarOverlayProps {
  onClose: () => void;
}

export default function WeeklyCalendarOverlay({ onClose }: WeeklyCalendarOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);
  const { weeklyPlan, updateWeeklyPlan } = useBudget();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMealSlot, setSelectedMealSlot] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the animation duration
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // No dependencies needed since handleClose is defined inline

  // Handle restaurant selection from map
  useEffect(() => {
    const handleRestaurantSelect = (event: CustomEvent) => {
      if (event.detail && selectedDay && selectedMealSlot) {
        const restaurant = event.detail.restaurant;
        updateWeeklyPlan(selectedDay, selectedMealSlot, restaurant.name);
      }
    };

    window.addEventListener("restaurantSelect", handleRestaurantSelect as EventListener);
    return () => window.removeEventListener("restaurantSelect", handleRestaurantSelect as EventListener);
  }, [selectedDay, selectedMealSlot, updateWeeklyPlan]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["breakfast", "lunch", "dinner"];

  // Function to send the weekly plan data to Firebase
  const saveWeeklyMealPlanToFirebase = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("❌ No authenticated user found.");
      return;
    }
    const mealPlanRef = doc(db, "users", user.uid, "mealPlan", "calendar");
    try {
      await setDoc(mealPlanRef, weeklyPlan, { merge: true });
      console.log("✅ Weekly meal plan saved to Firebase");
    } catch (error) {
      console.error("❌ Error saving weekly meal plan:", error);
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
                    weeklyPlan[day.toLowerCase()]
                      ? weeklyPlan[day.toLowerCase()][mealType] || ""
                      : ""
                  }
                  onChange={(e) => updateWeeklyPlan(day.toLowerCase(), mealType, e.target.value)}
                  onFocus={() => {
                    setSelectedDay(day.toLowerCase());
                    setSelectedMealSlot(mealType);
                  }}
                  placeholder={`Select restaurant or enter ${mealType} plan`}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Button to update and send the weekly meal plan data to Firebase */}
        <div className={styles.saveButtonContainer}>
          <button className={styles.saveButton} onClick={saveWeeklyMealPlanToFirebase}>
            Save Weekly Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}
