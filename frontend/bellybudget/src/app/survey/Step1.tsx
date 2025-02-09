"use client";

import React from "react";
import styles from "./survey.module.css";

// Define the survey data interface.
// This should match the one in your Survey page.
export interface SurveyData {
  dietaryRestrictions: string;
  mealsPerDay: string;
  cuisinePreferences: string[];
  diningPreference: string;
  allergies: string[];
  weeklyBudget: string;
}

// Define the props for Step1 using SurveyData
interface Step1Props {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  handleNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData, handleNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, dietaryRestrictions: e.target.value });
  };

  return (
    <div>
      <h2>Dietary Restrictions</h2>
      <p>Select if you have any dietary restrictions (optional)</p>
      <select
        className={styles.selectInput}
        name="dietaryRestrictions"
        value={formData.dietaryRestrictions}
        onChange={handleChange}
      >
        <option value="">No Restrictions</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="pescatarian">Pescatarian</option>
        <option value="gluten-free">Gluten-Free</option>
        <option value="halal">Halal</option>
        <option value="kosher">Kosher</option>
      </select>
      <div className={styles.buttonContainer} style={{ marginTop: "2rem", justifyContent: "center" }}>
        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
