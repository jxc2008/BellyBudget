import styles from "./survey.module.css"

const Step5 = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(value)
        ? prev.allergies.filter((item) => item !== value)
        : [...prev.allergies, value],
    }))
  }

  const handleNoneClick = () => {
    setFormData((prev) => ({
      ...prev,
      allergies: ["none"]
    }))
  }

  const handleAllergiesChange = (value) => {
    if (value === "none") {
      // If "none" is clicked, clear all other selections
      setFormData((prev) => ({
        ...prev,
        allergies: ["none"]
      }))
    } else {
      // If any other allergy is selected, remove "none" if it exists
      setFormData((prev) => ({
        ...prev,
        allergies: prev.allergies
          .filter(item => item !== "none")
          .concat(prev.allergies.includes(value) 
            ? [] 
            : [value])
      }))
    }
  }

  const handleNextStep = () => {
    if (formData.allergies.length === 0) {
      alert("Please select at least one option or click 'None'")
      return
    }
    handleNext()
  }

  const commonAllergies = ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Fish", "Shellfish", "Soy", "Wheat"]

  return (
    <div>
      <h2>Allergies</h2>
      <div className={styles.checkboxGroup}>
        {commonAllergies.map((allergy) => (
          <label 
            key={allergy} 
            className={`${styles.checkboxLabel} ${
              formData.allergies.includes("none") ? styles.disabled : ""
            }`}
          >
            <input
              type="checkbox"
              value={allergy}
              onChange={(e) => handleAllergiesChange(e.target.value)}
              checked={formData.allergies.includes(allergy)}
              disabled={formData.allergies.includes("none")}
            />
            <span>{allergy}</span>
          </label>
        ))}
      </div>
      
      {/* None button */}
      <button
        className={`${styles.noneButton} ${
          formData.allergies.includes("none") ? styles.activeNone : ""
        }`}
        onClick={handleNoneClick}
        style={{ 
          margin: "2rem auto",
          padding: "0.5rem 2rem",
          borderRadius: "20px",
          border: "2px solid #3498db",
          background: formData.allergies.includes("none") ? "#3498db" : "transparent",
          color: formData.allergies.includes("none") ? "white" : "#3498db",
          cursor: "pointer",
          display: "block"
        }}
      >
        No Allergies
      </button>

      <div className={styles.buttonContainer} style={{ marginTop: "2rem" }}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.nextButton} onClick={handleNextStep}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Step5