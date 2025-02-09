import { useState, useEffect } from "react";
import styles from "./RestaurantDetails.module.css";
import { useBudget } from "@/contexts/BudgetContext";

export default function RestaurantDetails({ restaurant, onClose }) {
  const { updateWeeklyPlan } = useBudget();
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedMeal, setSelectedMeal] = useState("lunch");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const handleAddToCalendar = () => {
    updateWeeklyPlan(selectedDay, selectedMeal, restaurant.name);
    handleClose();
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.details}`)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.details} ${isClosing ? styles.closing : ""}`}>
      <button className={styles.closeButton} onClick={handleClose}>×</button>
      <h2>{restaurant.name}</h2>
      <p>Price: ${restaurant.price}</p>

      {/* Meal selection dropdowns */}
      <div className={styles.selectionContainer}>
        <label>Day:</label>
        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
          ))}
        </select>

        <label>Meal:</label>
        <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <option key={meal} value={meal}>{meal.charAt(0).toUpperCase() + meal.slice(1)}</option>
          ))}
        </select>
      </div>

      <button className={styles.addButton} onClick={handleAddToCalendar}>
        Add to {selectedMeal} on {selectedDay}
      </button>
    </div>
  );
}