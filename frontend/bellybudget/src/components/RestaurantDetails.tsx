import { useState, useEffect } from "react";
import styles from "./RestaurantDetails.module.css";
// Import the updateMealPlan function directly from your firebase module.
import { updateMealPlan } from "@/lib/firebase";

export default function RestaurantDetails({ restaurant, onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [selectedMeal, setSelectedMeal] = useState("lunch");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const handleAddToCalendar = () => {
    // Create a restaurant event object with details you want stored.
    // You can add additional fields as needed.
    const restaurantEvent = {
      name: restaurant.name,
      rating: restaurant.rating || 0,
      estimated_cost: restaurant.estimated_cost || Number(restaurant.price) || 0,
      // You might include additional info such as address, time, etc.
    };

    // Call the Firebase update function so that the meal plan for the selected day
    // and meal slot is updated with this restaurant event.
    updateMealPlan(selectedDay, selectedMeal, restaurantEvent);
    handleClose();
  };

  // Close when clicking outside of the details container.
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
            <option key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>

        <label>Meal:</label>
        <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <option key={meal} value={meal}>
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button className={styles.addButton} onClick={handleAddToCalendar}>
        Add to {selectedMeal} on {selectedDay}
      </button>
    </div>
  );
}
