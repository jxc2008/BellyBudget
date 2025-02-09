"use client";

import React from "react";
import styles from "./survey.module.css";

// Define the structure of your survey data
interface SurveyData {
  dietaryRestrictions: string;
  mealsPerDay: string;
  cuisinePreferences: string[];
  diningPreference: string;
  allergies: string[];
  weeklyBudget: string;
}

// Define the props for Step6
interface Step6Props {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  handleBack: () => void;
  handleSubmit: () => void;
}

const Step6: React.FC<Step6Props> = ({ formData, setFormData, handleBack, handleSubmit }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, weeklyBudget: e.target.value });
  };

  const handleSubmitAndReveal = () => {
    if (Number.parseFloat(formData.weeklyBudget) < 50) {
      alert("Weekly budget must be at least $50");
      return;
    }
    console.log("Survey completed:", formData);
    // Call parent's handleSubmit; do not redirect here.
    handleSubmit();
  };

  return (
    <div>
      <h2>Weekly Budget</h2>
      <input
        className={styles.selectInput}
        type="number"
        name="weeklyBudget"
        value={formData.weeklyBudget}
        onChange={handleChange}
        placeholder="Enter your weekly budget (min $50)"
        min="50"
      />
      <div className={styles.buttonContainer} style={{ marginTop: "2rem" }}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.submitButton} onClick={handleSubmitAndReveal}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step6;
