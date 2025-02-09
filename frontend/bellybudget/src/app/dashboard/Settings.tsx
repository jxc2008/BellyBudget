"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import styles from "./Settings.module.css"

const Settings: React.FC = () => {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [hasSurveyData, setHasSurveyData] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setLoading(true)
        
        // Load local settings
        const storedDarkMode = localStorage.getItem("darkMode")
        const storedNotifications = localStorage.getItem("notificationsEnabled")
        
        if (storedDarkMode !== null) {
          setDarkMode(storedDarkMode === "true")
          if (storedDarkMode === "true") {
            document.body.classList.add("dark")
          }
        }
        
        if (storedNotifications !== null) {
          setNotificationsEnabled(storedNotifications === "true")
        }

        // Check for survey data
        const currentUser = auth.currentUser
        if (currentUser) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists() && userDoc.data().surveyData) {
            setHasSurveyData(true)
          } else {
            setHasSurveyData(false)
          }
        }
      } catch (error) {
        console.error("Error initializing settings:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeSettings()
  }, [])

  const toggleDarkMode = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    localStorage.setItem("darkMode", newValue.toString())
    if (newValue) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled
    setNotificationsEnabled(newValue)
    localStorage.setItem("notificationsEnabled", newValue.toString())
  }

  const resetSettings = () => {
    setDarkMode(false)
    setNotificationsEnabled(true)
    localStorage.setItem("darkMode", "false")
    localStorage.setItem("notificationsEnabled", "true")
    document.body.classList.remove("dark")
  }

  const handleSurveyClick = () => {
    router.push('/survey')
  }

  if (loading) {
    return <div className={styles.settingsContainer}>Loading...</div>
  }

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.sectionTitle}>Settings</h2>
      
      <div className={styles.settingItem}>
        <label className={styles.label}>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
          className={styles.toggle}
        />
      </div>
      
      <div className={styles.settingItem}>
        <label className={styles.label}>Enable Notifications</label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={toggleNotifications}
          className={styles.toggle}
        />
      </div>

      <div className={styles.settingItem}>
        <label className={styles.label}>
          Preferences Survey
          <p className={styles.surveyStatus}>
            {hasSurveyData ? "Update your preferences" : "Complete your preferences survey"}
          </p>
        </label>
        <button 
          onClick={handleSurveyClick}
          className={`${styles.surveyButton} ${!hasSurveyData ? styles.highlight : ''}`}
        >
          {hasSurveyData ? "Update Survey" : "Take Survey"}
        </button>
      </div>
      
      <div className={styles.settingItem}>
        <button className={styles.resetButton} onClick={resetSettings}>
          Reset Settings to Default
        </button>
      </div>
    </div>
  )
}

export default Settings