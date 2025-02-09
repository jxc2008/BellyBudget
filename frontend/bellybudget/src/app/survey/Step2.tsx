import styles from "./survey.module.css"

const Step2 = ({ formData, setFormData, handleNext, handleBack }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, mealsPerDay: e.target.value })
  }

  const handleNextStep = () => {
    if (!formData.mealsPerDay) {
      alert("Please select the number of meals per day before proceeding.")
      return
    }
    handleNext()
  }

  return (
    <div>
      <h2>Meals Per Day</h2>
      <select className={styles.selectInput} name="mealsPerDay" value={formData.mealsPerDay} onChange={handleChange}>
        <option value="">Select number of meals</option>
        <option value="1">1 meal</option>
        <option value="2">2 meals</option>
        <option value="3">3 meals</option>
        <option value="4">4 meals</option>
        <option value="5+">5+ meals</option>
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
  )
}

export default Step2