// calendar.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Utensils } from "lucide-react";
import { db, auth, subscribeToMealPlan, updateMealPlan } from "@/lib/firebase";
import { doc, onSnapshot, deleteField, updateDoc } from "firebase/firestore";
import styles from "./Calendar.module.css";

// Define interfaces for meal and restaurant plans
interface MealPlan {
  breakfast: any;
  lunch: any;
  dinner: any;
}

interface WeeklyPlan {
  [key: string]: MealPlan;
}

interface RestaurantPlan {
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  estimatedCost: number;
  notes?: string;
}

interface RestaurantPlans {
  [date: string]: RestaurantPlan;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<WeeklyPlan>({});
  const [restaurantPlans, setRestaurantPlans] = useState<RestaurantPlans>({});

  // Subscribe to restaurant plans from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const plansRef = doc(db, "users", user.uid, "restaurantPlans", "calendar");
    const unsubscribe = onSnapshot(plansRef, (docSnap) => {
      if (docSnap.exists()) {
        setRestaurantPlans(docSnap.data() as RestaurantPlans);
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to weekly meal plan updates from Firebase
  useEffect(() => {
    const unsubscribeMealPlan = subscribeToMealPlan((data) => {
      setWeeklyMealPlan(data);
    });
    return () => unsubscribeMealPlan();
  }, []);

  /**
   * Compute the next occurrence date (as an ISO string) for each weekday that has a meal plan.
   */
  const nextMealPlanOccurrence = useMemo(() => {
    const today = new Date();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const result: { [weekday: string]: string } = {};

    Object.entries(weeklyMealPlan).forEach(([weekday, mealPlan]) => {
      if (mealPlan.breakfast || mealPlan.lunch || mealPlan.dinner) {
        const targetIndex = daysOfWeek.indexOf(weekday);
        const fromIndex = today.getDay();
        const delta = (targetIndex - fromIndex + 7) % 7;
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + delta);
        result[weekday] = nextDate.toISOString().split("T")[0];
      }
    });

    return result;
  }, [weeklyMealPlan]);

  /**
   * Returns the meal plan for a given date (only if it is the “next occurrence” for that weekday).
   */
  const getMealPlan = useCallback(
    (date: Date): MealPlan => {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const dateString = date.toISOString().split("T")[0];
      if (weeklyMealPlan[dayOfWeek] && nextMealPlanOccurrence[dayOfWeek] === dateString) {
        return weeklyMealPlan[dayOfWeek];
      }
      return { breakfast: "", lunch: "", dinner: "" };
    },
    [weeklyMealPlan, nextMealPlanOccurrence]
  );

  /**
   * Returns the restaurant plan for a specific date.
   */
  const getRestaurantPlan = useCallback(
    (date: Date): RestaurantPlan | null => {
      const dateString = date.toISOString().split("T")[0];
      return restaurantPlans[dateString] || null;
    },
    [restaurantPlans]
  );

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const generateCalendarDays = useCallback(() => {
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={styles.emptyDay} aria-hidden="true" />
      );
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const mealPlan = getMealPlan(date);
      const restaurantPlan = getRestaurantPlan(date);
      const hasMeals = mealPlan.breakfast || mealPlan.lunch || mealPlan.dinner;

      days.push(
        <div
          key={day}
          className={`${styles.day} ${isToday ? styles.today : ""} ${
            isSelected ? styles.selected : ""
          } ${hasMeals || restaurantPlan ? styles.hasMeals : ""}`}
          onClick={() => setSelectedDate(date)}
          role="button"
          tabIndex={0}
          aria-label={`${date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}${hasMeals ? ", has meals planned" : ""}${
            restaurantPlan ? `, Restaurant: ${restaurantPlan.restaurantName}` : ""
          }`}
          aria-selected={isSelected}
        >
          <span className={styles.dayNumber}>{day}</span>
          <div className={styles.mealIndicators} aria-hidden="true">
            {mealPlan.breakfast && (
              <div
                className={styles.mealDot}
                data-meal="breakfast"
                title="Breakfast planned"
              />
            )}
            {mealPlan.lunch && (
              <div
                className={styles.mealDot}
                data-meal="lunch"
                title="Lunch planned"
              />
            )}
            {mealPlan.dinner && (
              <div
                className={styles.mealDot}
                data-meal="dinner"
                title="Dinner planned"
              />
            )}
            {restaurantPlan && (
              <div
                className={`${styles.mealDot} ${styles.restaurantDot}`}
                title={`Restaurant: ${restaurantPlan.restaurantName} at ${restaurantPlan.time}`}
              >
                <Utensils size={10} />
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  }, [
    currentDate,
    selectedDate,
    startingDay,
    daysInMonth,
    getMealPlan,
    getRestaurantPlan,
  ]);

  // Remove the restaurant plan for the selected date
  const handleRemoveRestaurant = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const planRef = doc(db, "users", user.uid, "restaurantPlans", "calendar");
    const dateKey = selectedDate.toISOString().split("T")[0];
    try {
      await updateDoc(planRef, { [dateKey]: deleteField() });
      console.log("Restaurant plan removed successfully");
    } catch (error) {
      console.error("Error removing restaurant plan:", error);
    }
  };

  // Remove a meal (breakfast, lunch, or dinner) for the selected date
  const handleRemoveMeal = async (meal: string) => {
    const dayKey = selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    try {
      await updateMealPlan(dayKey, meal, "");
      console.log(`${meal} removed successfully`);
    } catch (error) {
      console.error(`Error removing ${meal}:`, error);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={previousMonth} className={styles.navigationButton} aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthYear}>
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={nextMonth} className={styles.navigationButton} aria-label="Next month">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.weekdays} role="row">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={styles.weekday} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className={styles.days} role="grid">
        {generateCalendarDays()}
      </div>

      {selectedDate && (
        <div className={styles.selectedDateMeals}>
          <h3 className={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className={styles.mealsList}>
            {["breakfast", "lunch", "dinner"].map((meal) => {
              const plan = getMealPlan(selectedDate)[meal];
              let displayPlan = "No meal planned";
              if (plan) {
                if (typeof plan === "object") {
                  displayPlan = `${plan.name} (${plan.rating}★) - $${plan.estimated_cost.toFixed(2)}`;
                } else {
                  displayPlan = plan;
                }
              }
              return (
                <div key={meal} className={styles.mealItem}>
                  <span className={styles.mealType}>
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </span>
                  <span className={styles.mealPlan}>{displayPlan}</span>
                  {plan && plan !== "" && (
                    <button
                      onClick={() => handleRemoveMeal(meal)}
                      className={styles.removeButton}
                      aria-label={`Remove ${meal} plan`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            {getRestaurantPlan(selectedDate) && (
              <div className={`${styles.mealItem} ${styles.restaurantItem}`}>
                <div className={styles.restaurantHeader}>
                  <span className={styles.mealType}>Restaurant</span>
                  <button
                    onClick={handleRemoveRestaurant}
                    className={styles.removeButton}
                    aria-label="Remove restaurant plan"
                  >
                    Remove
                  </button>
                </div>
                <span className={styles.mealPlan}>
                  {getRestaurantPlan(selectedDate)?.restaurantName} at {getRestaurantPlan(selectedDate)?.time}
                  <div className={styles.restaurantCost}>
                    Estimated cost: ${getRestaurantPlan(selectedDate)?.estimatedCost.toFixed(2)}
                  </div>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
