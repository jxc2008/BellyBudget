"use client";

import React, { useState, useEffect } from "react";
import styles from "./RestaurantDetails.module.css";
// Import the updateMealPlan function directly from your firebase module.
import { updateMealPlan } from "@/lib/firebase";

// Define an interface for the restaurant object.
interface Restaurant {
  name: string;
  price: number | string;
  rating?: number;
  estimated_cost?: number;
}

// Define the props interface for RestaurantDetails.
interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant, onClose }) => {
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [selectedMeal, setSelectedMeal] = useState<string>("lunch");

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const handleAddToCalendar = () => {
    // Instead of passing an object, pass just the restaurant's name (a string).
    updateMealPlan(selectedDay, selectedMeal, restaurant.name);
    handleClose();
  };

  // Close the details view when clicking outside of the container.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.details}`)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.details} ${isClosing ? styles.closing : ""}`}>
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
      <h2>{restaurant.name}</h2>
      <p>Price: ${restaurant.price}</p>

      {/* Meal selection dropdowns */}
      <div className={styles.selectionContainer}>
        <label>Day:</label>
        <select
          value={selectedDay}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedDay(e.target.value)
          }
        >
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <option key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </option>
          ))}
        </select>

        <label>Meal:</label>
        <select
          value={selectedMeal}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedMeal(e.target.value)
          }
        >
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
};

export default RestaurantDetails;
