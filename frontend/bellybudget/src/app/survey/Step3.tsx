import styles from "./survey.module.css"

const Step3 = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(value)
        ? prev.cuisinePreferences.filter((item) => item !== value)
        : [...prev.cuisinePreferences, value],
    }))
  }

  const handleNextStep = () => {
    if (formData.cuisinePreferences.length === 0) {
      alert("Please select at least one cuisine preference before proceeding.")
      return
    }
    handleNext()
  }

  const cuisines = [
    "Italian",
    "Mexican",
    "Japanese",
    "Indian",
    "Chinese",
    "Thai",
    "French",
    "Greek",
    "Spanish",
    "Korean",
    "Vietnamese",
    "American",
    "Mediterranean",
    "Middle Eastern",
    "Brazilian",
    "Caribbean",
    "African",
    "German",
    "Turkish",
    "Lebanese",
  ]

  return (
    <div>
      <h2>Cuisine Preferences</h2>
      <div className={styles.checkboxGroup}>
        {cuisines.map((cuisine) => (
          <label key={cuisine} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={cuisine}
              onChange={handleChange}
              checked={formData.cuisinePreferences.includes(cuisine)}
            />
            <span>{cuisine}</span>
          </label>
        ))}
      </div>
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

export default Step3