"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { useBudget } from "@/contexts/BudgetContext"
import styles from "./WeeklyCalendarOverlay.module.css"

export default function WeeklyCalendarOverlay({ onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const { weeklyPlan, updateWeeklyPlan } = useBudget()
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedMealSlot, setSelectedMealSlot] = useState(null)
  const overlayRef = useRef(null)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300) // Match this with the animation duration
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClose]) // Added handleClose to dependencies

  // Handle restaurant selection from map
  useEffect(() => {
    const handleRestaurantSelect = (event) => {
      if (event.detail && selectedDay && selectedMealSlot) {
        const restaurant = event.detail.restaurant
        updateWeeklyPlan(selectedDay, selectedMealSlot, restaurant.name)
      }
    }

    window.addEventListener("restaurantSelect", handleRestaurantSelect)
    return () => window.removeEventListener("restaurantSelect", handleRestaurantSelect)
  }, [selectedDay, selectedMealSlot, updateWeeklyPlan])

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const mealTypes = ["breakfast", "lunch", "dinner"]

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}>
      <div className={`${styles.calendar} ${isClosing ? styles.closing : ""}`} ref={overlayRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>Weekly Meal Plan</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Close calendar">
            <X size={24} />
          </button>
        </div>

        {days.map((day) => (
          <div key={day} className={styles.day}>
            <div className={styles.dayHeader}>
              <h3>{day}</h3>
            </div>
            {mealTypes.map((mealType) => (
              <div key={`${day}-${mealType}`} className={styles.meal}>
                <label className={styles.mealLabel}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</label>
                <input
                  type="text"
                  className={styles.mealInput}
                  value={weeklyPlan[day.toLowerCase()][mealType] || ""}
                  onChange={(e) => updateWeeklyPlan(day.toLowerCase(), mealType, e.target.value)}
                  onFocus={() => {
                    setSelectedDay(day.toLowerCase())
                    setSelectedMealSlot(mealType)
                  }}
                  placeholder={`Select restaurant or enter ${mealType} plan`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

