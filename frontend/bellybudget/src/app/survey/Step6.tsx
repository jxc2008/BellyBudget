import styles from "./survey.module.css"
import { useRouter } from "next/navigation"

const Step6 = ({ formData, setFormData, handleBack, handleSubmit }) => {
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, weeklyBudget: e.target.value })
  }

  const handleSubmitAndRedirect = () => {
    if (Number.parseFloat(formData.weeklyBudget) < 50) {
      alert("Weekly budget must be at least $50")
      return
    }
    console.log("Survey completed:", formData)
    alert("Thank you for completing the survey!")
    handleSubmit() // Call the handleSubmit function from props
    router.push("/dashboard") // Redirect to the dashboard
  }

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
      {/* Add margin-top to create space between the input and buttons */}
      <div className={styles.buttonContainer} style={{ marginTop: "2rem" }}>
        <button className={styles.backButton} onClick={handleBack}>
          Back
        </button>
        <button className={styles.submitButton} onClick={handleSubmitAndRedirect}>
          Submit
        </button>
      </div>
    </div>
  )
}

export default Step6