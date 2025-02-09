"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import { insertMealPlan } from "@/lib/firebase"; // This now uses your new API-backed function
import styles from "./survey.module.css";

const Survey = () => {
  const router = useRouter();

  // Manage survey steps and form data
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    dietaryRestrictions: "",
    mealsPerDay: "",
    cuisinePreferences: [],
    diningPreference: "",
    allergies: [],
    weeklyBudget: "",
  });

  // New state for showing the modal and tracking the meal plan insertion
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          router.push("/auth");
          return;
        }
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.surveyData) {
            setFormData(userData.surveyData);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const validateFormData = (data) => {
    return (
      data.mealsPerDay &&
      data.cuisinePreferences.length > 0 &&
      data.diningPreference &&
      (data.allergies.length > 0 || data.allergies.includes("none")) &&
      Number(data.weeklyBudget) >= 50
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      setLoading(true);
      const isValid = validateFormData(formData);
      if (!isValid) {
        throw new Error("Please complete all required fields");
      }

      const surveyData = {
        surveyData: {
          ...formData,
          lastUpdated: serverTimestamp(),
          userId: user.uid,
          email: user.email,
        },
      };

      await setDoc(doc(db, "users", user.uid), surveyData, { merge: true });
      console.log("✅ Survey data saved successfully");
      // Instead of redirecting immediately, display the modal.
      setShowMealPlanModal(true);
    } catch (err: any) {
      console.error("Error saving survey data:", err);
      setError(err.message || "Failed to save your survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsertMealPlan = async () => {
    setMealPlanLoading(true);
    try {
      const data = await insertMealPlan();
      console.log("✅ Meal plan inserted:", data);
      // After inserting the meal plan, redirect to the calendar page.
      router.push("/dashboard");
    } catch (error) {
      console.error("Error inserting meal plan:", error);
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setMealPlanLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showMealPlanModal ? (
        // Modal overlay that completely replaces the survey view
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Congratulations!</h2>
            <p>Your survey has been submitted successfully.</p>
            <p>Click the button below to reveal your personalized meal plan.</p>
            <button
              onClick={handleInsertMealPlan}
              disabled={mealPlanLoading}
              className={styles.mealPlanButton}
            >
              {mealPlanLoading ? "Generating..." : "Reveal Your Personalized Meal Plan"}
            </button>
          </div>
        </div>
      ) : (
        // Render the survey content if the modal is not shown
        <div className={styles.surveyBox}>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${(step / 6) * 100}%` }} />
          </div>
          <div className={styles.stepContainer}>
            {step === 0 && (
              <div className={styles.welcomeStep}>
                <h1>Welcome to BellyBudget!</h1>
                <p>
                  Thank you for joining BellyBudget! We're excited to help you plan your meals,
                  manage your budget, and explore delicious dining experiences.
                </p>
                <p>
                  Please take a moment to read about what BellyBudget is all about. When you're ready, click the "Next" button to begin our short survey.
                </p>
                <button className={styles.nextButton} onClick={handleNext}>
                  Next
                </button>
              </div>
            )}
            {step === 1 && (
              <Step1 formData={formData} setFormData={setFormData} handleNext={handleNext} />
            )}
            {step === 2 && (
              <Step2 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />
            )}
            {step === 3 && (
              <Step3 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />
            )}
            {step === 4 && (
              <Step4 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />
            )}
            {step === 5 && (
              <Step5 formData={formData} setFormData={setFormData} handleNext={handleNext} handleBack={handleBack} />
            )}
            {step === 6 && (
              <Step6 formData={formData} setFormData={setFormData} handleBack={handleBack} handleSubmit={handleSubmit} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey;
