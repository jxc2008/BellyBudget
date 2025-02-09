"use client"

import { useBudget } from "@/contexts/BudgetContext"
import styles from "./WeeklyCalendar.module.css"

export default function WeeklyCalendar({ onClose }) {
  const { weeklyPlan, updateWeeklyPlan, recommendedRestaurants } = useBudget()

  const handleMealUpdate = (day, mealType, value) => {
    updateWeeklyPlan(day, mealType, value)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.calendar}>
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <h2>Weekly Meal Plan</h2>
        {Object.entries(weeklyPlan).map(([day, meals]) => (
          <div key={day} className={styles.day}>
            <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
            {Object.entries(meals).map(([mealType, mealValue]) => (
              <div key={mealType} className={styles.meal}>
                <label>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</label>
                <input
                  type="text"
                  value={mealValue}
                  onChange={(e) => handleMealUpdate(day, mealType, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
        <div className={styles.recommendations}>
          <h3>Recommended Restaurants</h3>
          <ul>
            {recommendedRestaurants.map((restaurant) => (
              <li key={restaurant.id}>
                {restaurant.name} - ${restaurant.price}
                <button onClick={() => handleMealUpdate("monday", "lunch", restaurant.name)}>Add to Plan</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

