import styles from "./survey.module.css";

const Step6 = ({ formData, setFormData, handleBack, handleSubmit }) => {
  const handleChange = (e) => {
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
