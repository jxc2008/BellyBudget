"use client"; // Required for React state in Next.js App Router

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use `next/navigation` in App Router
import styles from "./page.module.css"; // Assuming CSS module exists

export default function Home() {
  const [budget, setBudget] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>BellyBudget</h1>
      <p className={styles.subtitle}>Plan your meals based on your budget!</p>

      <div className={styles.formContainer}>
        <label className={styles.label}>Enter Your Budget ($)</label>
        <input
          type="number"
          className={styles.input}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <label className={styles.label}>Meals per Day</label>
        <input
          type="number"
          className={styles.input}
          value={mealsPerDay}
          onChange={(e) => setMealsPerDay(Number(e.target.value))}
        />

        <button 
          className={styles.button} 
          onClick={() => router.push(`/mealplan?budget=${budget}&mealsPerDay=${mealsPerDay}`)}
        >
          Generate Meal Plan
        </button>
      </div>
    </div>
  );
}
