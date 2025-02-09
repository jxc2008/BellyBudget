"use client"

import { useState, useEffect, useRef } from "react"
import { useBudget } from "@/contexts/BudgetContext"
import styles from "./DailyTimeline.module.css"

export default function DailyTimeline() {
  const { meals } = useBudget()
  const [isHovered, setIsHovered] = useState(false)
  const timelineRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect()
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      className={`${styles.timeline} ${isHovered ? styles.hovered : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={timelineRef}
    >
      <div
        className={styles.timelineMask}
        style={{
          background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, 
                     rgba(255,255,255,0.2) 0%, 
                     rgba(255,255,255,0.1) 50%, 
                     rgba(255,255,255,0) 100%)`,
        }}
      />
      <div className={styles.timelineContent}>
        <h2 className={styles.title}>Today's Meals</h2>
        {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
          <div key={mealType} className={styles.meal}>
            <h3>{mealType}</h3>
            <p>{meals[mealType.toLowerCase()] || "Not planned"}</p>
          </div>
        ))}
      </div>
      <div className={styles.timelineTicks}>
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className={styles.tick}>
            <span className={styles.tickLabel}>{index}:00</span>
          </div>
        ))}
      </div>
    </div>
  )
}

