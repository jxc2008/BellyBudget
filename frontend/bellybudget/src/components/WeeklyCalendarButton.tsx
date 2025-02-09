"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import WeeklyCalendarOverlay from "./WeeklyCalendarOverlay"
import styles from "./WeeklyCalendarButton.module.css"

export default function WeeklyCalendarButton() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <>
      <button
        className={styles.calendarButton}
        onClick={() => setIsCalendarOpen(true)}
        aria-label="Open Weekly Calendar"
      >
        <Calendar className={styles.calendarIcon} size={20} />
        <span>Weekly Plan</span>
      </button>
      {isCalendarOpen && <WeeklyCalendarOverlay onClose={() => setIsCalendarOpen(false)} />}
    </>
  )
}