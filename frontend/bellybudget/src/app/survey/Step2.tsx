"use client";

import React from "react";
import styles from "./survey.module.css";

// Define the shape of the survey data (should match your SurveyData interface)
interface SurveyData {
  dietaryRestrictions: string;
  mealsPerDay: string;
  cuisinePreferences: string[];
  diningPreference: string;
  allergies: string[];
  weeklyBudget: string;
}

// Define the props for Step2
interface Step2Props {
  formData: SurveyData;
  setFormData: React.Dispatch<React.SetStateAction<SurveyData>>;
  handleNext: () => void;
  handleBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, mealsPerDay: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.mealsPerDay) {
      alert("Please select the number of meals per day before proceeding.");
      return;
    }
    handleNext();
  };

  return (
    <div>
      <h2>Meals Per Day</h2>
      <select
        className={styles.selectInput}
        name="mealsPerDay"
        value={formData.mealsPerDay}
        onChange={handleChange}
      >
        <option value="">Select number of meals</option>
        <option value="1">1 meal</option>
        <option value="2">2 meals</option>
        <option value="3">3 meals</option>
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

export default Step2;
