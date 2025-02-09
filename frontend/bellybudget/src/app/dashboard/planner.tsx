"use client"
import { BudgetProvider } from "@/contexts/BudgetContext"
import Map from "@/components/Map"
import Timeline from "@/components/Timeline"
import WeeklyCalendarButton from "@/components/WeeklyCalendarButton"
import styles from "./dashboard.module.css"

export default function Planner() {
  return (
    <BudgetProvider>
      <div className={styles.plannerContainer}>
        <WeeklyCalendarButton />
        <div className={styles.plannerContent}>
          <Map />
          <Timeline />
        </div>
      </div>
    </BudgetProvider>
  )
}