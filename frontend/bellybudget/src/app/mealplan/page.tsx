"use client";

import { useSearchParams } from "next/navigation"; // Use this in App Router
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../page.module.css"; // Reuse styles from home page

export default function MealPlan() {
  const searchParams = useSearchParams();
  const budget = searchParams.get("budget");
  const mealsPerDay = searchParams.get("mealsPerDay");

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await axios.get("/api/meals");
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeals();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Your Meal Plan</h1>
      <p>Budget: ${budget}, Meals per day: {mealsPerDay}</p>
      
      {loading ? <p>Loading...</p> : meals.map((meal, index) => (
        <div key={index} className={styles.mealItem}>
          {meal.name} - ${meal.price}
        </div>
      ))}
    </div>
  );
}
