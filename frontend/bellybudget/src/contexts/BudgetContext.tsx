"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define types for a day's meal plan.
export interface DailyMealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

// Define the type for the weekly plan.
export interface WeeklyPlan {
  monday: DailyMealPlan;
  tuesday: DailyMealPlan;
  wednesday: DailyMealPlan;
  thursday: DailyMealPlan;
  friday: DailyMealPlan;
  saturday: DailyMealPlan;
  sunday: DailyMealPlan;
}

// Define the type for meals.
export interface Meals {
  breakfast: string;
  lunch: string;
  dinner: string;
}

// Define the shape of the BudgetContext.
interface BudgetContextType {
  budget: number;
  setBudget: Dispatch<SetStateAction<number>>;
  meals: Meals;
  setMeals: Dispatch<SetStateAction<Meals>>;
  weeklyPlan: WeeklyPlan;
  updateWeeklyPlan: (day: keyof WeeklyPlan, mealType: keyof Meals, value: string) => void;
}

// Create the context with an initial undefined value.
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Define the props for the provider.
interface BudgetProviderProps {
  children: ReactNode;
}

// Define and export the BudgetProvider.
export function BudgetProvider({ children }: BudgetProviderProps): JSX.Element {
  const [budget, setBudget] = useState<number>(100); // Weekly budget
  const [meals, setMeals] = useState<Meals>({
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });

  // Function to update the weekly plan.
  const updateWeeklyPlan = (
    day: keyof WeeklyPlan,
    mealType: keyof Meals,
    value: string
  ): void => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: value,
      },
    }));
  };

  return (
    <BudgetContext.Provider
      value={{ budget, setBudget, meals, setMeals, weeklyPlan, updateWeeklyPlan }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook to use the BudgetContext.
export function useBudget(): BudgetContextType {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}
