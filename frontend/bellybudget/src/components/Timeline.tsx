"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useBudget } from "@/contexts/BudgetContext"
import styles from "./Timeline.module.css"

export default function Timeline() {
  const { weeklyPlan }: { weeklyPlan: Record<string, { breakfast: string; lunch: string; dinner: string }> } = useBudget()
  const [hoveredHour, setHoveredHour] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [mouseY, setMouseY] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const START_HOUR = 5 // 5 AM
  const END_HOUR = 22 // 10 PM
  const TOTAL_HOURS = END_HOUR - START_HOUR + 1

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getMealForHour = (hour: number) => {
    const currentDay = currentTime.toLocaleString("en-us", { weekday: "long" }).toLowerCase()
    const dailyPlan = weeklyPlan[currentDay]
    if (hour >= 6 && hour < 10) return dailyPlan.breakfast
    if (hour >= 11 && hour < 14) return dailyPlan.lunch
    if (hour >= 17 && hour < 21) return dailyPlan.dinner
    return null
  }

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}${period}`
  }

  const ticks = useMemo(() => {
    return Array.from({ length: TOTAL_HOURS }, (_, i) => {
      const hour = i + START_HOUR
      const meal = getMealForHour(hour)
      return { hour, meal }
    })
  }, [TOTAL_HOURS, currentTime, weeklyPlan, getMealForHour]) // Added getMealForHour to dependencies

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          const relativeY = e.clientY - rect.top
          if (relativeY >= 0 && relativeY <= rect.height) {
            const hour = START_HOUR + (relativeY / rect.height) * TOTAL_HOURS
            setHoveredHour(hour)
            setMouseY(relativeY)
            setIsExpanded(true)
          }
        } else {
          setHoveredHour(null)
          setIsExpanded(false)
        }
      }
    }

    const handleMouseLeave = () => {
      setHoveredHour(null)
      setIsExpanded(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    timelineRef.current?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      timelineRef.current?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [TOTAL_HOURS, START_HOUR])

  const getTickStyle = (hour: number) => {
    if (hoveredHour === null) return {}

    const distance = Math.abs(hour - hoveredHour)
    const maxDistance = 5
    const springFactor = Math.max(0, 1 - Math.pow(distance / maxDistance, 2))

    return {
      transform: `
        translateX(${springFactor * -15}px)
        scale(${1 + springFactor * 0.15})
      `,
    }
  }

  const currentTimePosition = useMemo(() => {
    const now = currentTime
    const currentHour = now.getHours() + now.getMinutes() / 60
    return Math.max(0, Math.min(100, ((currentHour - START_HOUR) / TOTAL_HOURS) * 100))
  }, [currentTime, START_HOUR, TOTAL_HOURS])

  return (
    <div className={`${styles.timeline} ${isExpanded ? styles.expanded : ""}`} ref={timelineRef}>
      <div className={styles.timelineTicks}>
        {ticks.map(({ hour, meal }) => (
          <div
            key={hour}
            className={`${styles.tick} ${hoveredHour !== null ? styles.tickHovered : ""}`}
            style={getTickStyle(hour)}
          >
            <span className={styles.tickLabel}>{formatHour(hour)}</span>
            <div className={styles.mealIndicator}>{meal && <div className={styles.mealDot} />}</div>
          </div>
        ))}
      </div>
      <div className={styles.currentTimeIndicator} style={{ top: `${currentTimePosition}%` }} />
      {hoveredHour !== null && (
        <div
          className={styles.timelineContent}
          style={{
            transform: `translateY(${mouseY}px)`,
          }}
        >
          <h3>{formatHour(Math.floor(hoveredHour))}</h3>
          <p>{getMealForHour(Math.floor(hoveredHour)) || "No meal planned"}</p>
        </div>
      )}
    </div>
  )
}

