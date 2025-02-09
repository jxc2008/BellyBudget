"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import Step4 from "./Step4"
import Step5 from "./Step5"
import Step6 from "./Step6"
import styles from "./survey.module.css"

const Survey = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    dietaryRestrictions: "",
    mealsPerDay: "",
    cuisinePreferences: [],
    diningPreference: "",
    allergies: [],
    weeklyBudget: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const currentUser = auth.currentUser
        if (!currentUser) {
          router.push('/auth') // Changed from /login to /auth
          return
        }

        setUser(currentUser)
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.surveyData) {
            setFormData(userData.surveyData)
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load your data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleNext = () => setStep((prev) => prev + 1)
  const handleBack = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    try {
      setLoading(true)
      // Updated validation to skip dietaryRestrictions check
      const isValid = validateFormData(formData)
      if (!isValid) {
        throw new Error("Please complete all required fields")
      }

      const surveyData = {
        surveyData: {
          ...formData,
          lastUpdated: serverTimestamp(),
          userId: user.uid,
          email: user.email,
        }
      }

      await setDoc(
        doc(db, "users", user.uid), 
        surveyData, 
        { merge: true }
      )

      console.log("✅ Survey data saved successfully")
      router.push("/dashboard")
    } catch (err) {
      console.error("Error saving survey data:", err)
      setError(err.message || "Failed to save your survey. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const validateFormData = (data) => {
    return (
      // Removed dietaryRestrictions check since it's optional
      data.mealsPerDay &&
      data.cuisinePreferences.length > 0 &&
      data.diningPreference &&
      (data.allergies.length > 0 || data.allergies.includes("none")) && // Allow "none" as valid
      Number(data.weeklyBudget) >= 50
    )
  }

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.surveyBox}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <div className={styles.stepContainer}>
          {step === 1 && (
            <Step1 
              formData={formData} 
              setFormData={setFormData} 
              handleNext={handleNext} 
            />
          )}
          {/* Rest of the steps remain the same */}
          {step === 2 && (
            <Step2 
              formData={formData} 
              setFormData={setFormData} 
              handleNext={handleNext} 
              handleBack={handleBack} 
            />
          )}
          {step === 3 && (
            <Step3 
              formData={formData} 
              setFormData={setFormData} 
              handleNext={handleNext} 
              handleBack={handleBack} 
            />
          )}
          {step === 4 && (
            <Step4 
              formData={formData} 
              setFormData={setFormData} 
              handleNext={handleNext} 
              handleBack={handleBack} 
            />
          )}
          {step === 5 && (
            <Step5 
              formData={formData} 
              setFormData={setFormData} 
              handleNext={handleNext} 
              handleBack={handleBack} 
            />
          )}
          {step === 6 && (
            <Step6 
              formData={formData} 
              setFormData={setFormData} 
              handleBack={handleBack} 
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Survey