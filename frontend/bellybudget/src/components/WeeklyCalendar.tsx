"use client";

import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import styles from "./WeeklyCalendar.module.css";

// Define the props for the WeeklyCalendar component.
interface WeeklyCalendarProps {
  onClose: () => void;
}

// Define a type for a recommended restaurant.
interface RecommendedRestaurant {
  id: string;
  name: string;
  price: number | string;
}

// Define a type for the weekly plan.
interface WeeklyPlan {
  [day: string]: {
    [mealType: string]: string;
  };
}

export default function WeeklyCalendar({ onClose }: WeeklyCalendarProps) {
  const { weeklyPlan, updateWeeklyPlan, recommendedRestaurants } = useBudget();

  // Temporarily cast updateWeeklyPlan to a function type that accepts three strings.
  const safeUpdateWeeklyPlan = updateWeeklyPlan as (day: string, mealType: string, value: string) => void;

  // Update meal function with explicit parameter types.
  const handleMealUpdate = (day: string, mealType: string, value: string): void => {
    safeUpdateWeeklyPlan(day, mealType, value);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.calendar}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h2>Weekly Meal Plan</h2>
        {Object.entries(weeklyPlan as WeeklyPlan).map(([day, meals]) => (
          <div key={day} className={styles.day}>
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {Object.entries(meals).map(([mealType, mealValue]) => (
              <div key={mealType} className={styles.meal}>
                <label>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                </label>
                <input
                  type="text"
                  value={mealValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleMealUpdate(day, mealType, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ))}
        <div className={styles.recommendations}>
          <h3>Recommended Restaurants</h3>
          <ul>
            {recommendedRestaurants.map((restaurant: RecommendedRestaurant) => (
              <li key={restaurant.id}>
                {restaurant.name} - ${restaurant.price}
                <button
                  onClick={() =>
                    handleMealUpdate("monday", "lunch", restaurant.name)
                  }
                >
                  Add to Plan
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
