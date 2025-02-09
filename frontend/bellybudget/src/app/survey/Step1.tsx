"use client";

import React from "react";
import styles from "./survey.module.css";

// Define the structure for your form data
interface FormData {
  dietaryRestrictions: string;
  // Add additional fields as needed
}

// Define the props for the Step1 component
interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ formData, setFormData, handleNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, dietaryRestrictions: e.target.value });
  };

  // Removed validation check since it's optional
  const handleNextStep = () => {
    handleNext();
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
      <div
        className={styles.buttonContainer}
        style={{ marginTop: "2rem", justifyContent: "center" }}
      >
        <button className={styles.nextButton} onClick={handleNextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
