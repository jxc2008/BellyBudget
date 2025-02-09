"use client"

import { createContext, useContext, useState } from "react"

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(100) // Weekly budget
  const [meals, setMeals] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  })
  const [weeklyPlan, setWeeklyPlan] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  })

  const updateWeeklyPlan = (day, mealType, value) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }))
  }

  return (
    <BudgetContext.Provider value={{ budget, setBudget, meals, setMeals, weeklyPlan, updateWeeklyPlan }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}

