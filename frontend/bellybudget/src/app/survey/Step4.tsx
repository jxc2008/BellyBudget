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

// Define the props for Step4
interface Step4Props {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  handleNext: () => void;
  handleBack: () => void;
}

const Step4: React.FC<Step4Props> = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, diningPreference: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.diningPreference) {
      alert("Please select a dining preference before proceeding.");
      return;
    }
    handleNext();
  };

  return (
    <div className={styles.stepContainer}>
      <h2>Dining Preference</h2>
      <p>How do you prefer to get your meals?</p>
      
      <select
        className={styles.selectInput}
        name="diningPreference"
        value={formData.diningPreference}
        onChange={handleChange}
      >
        <option value="">Select dining preference</option>
        <option value="dine-in">Dine-in</option>
        <option value="takeout">Takeout</option>
        <option value="delivery">Delivery</option>
        <option value="any">Any</option>
      </select>

      <div className={styles.buttonContainer} style={{ marginTop: "2rem" }}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.nextButton} onClick={handleNextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4;
