"use client";

import styles from "./survey.module.css";

const Step4 = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e) => {
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