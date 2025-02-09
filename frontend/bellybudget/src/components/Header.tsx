"use client"

import { useState } from "react"
import WeeklyCalendar from "./WeeklyCalendar"
import styles from "./Header.module.css"

export default function Header() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <header className={styles.header}>
      <button className={styles.calendarButton} onClick={() => setIsCalendarOpen(true)}>
        Open Weekly Calendar
      </button>
      <h1 className={styles.title}>Budget Food Planner</h1>
      {isCalendarOpen && <WeeklyCalendar onClose={() => setIsCalendarOpen(false)} />}
    </header>
  )
}

