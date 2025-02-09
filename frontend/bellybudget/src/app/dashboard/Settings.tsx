"use client";

import React, { useState, useEffect } from "react";
import styles from "./Settings.module.css";

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    const storedNotifications = localStorage.getItem("notificationsEnabled");
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === "true");
      if (storedDarkMode === "true") {
        document.body.classList.add("dark");
      }
    }
    if (storedNotifications !== null) {
      setNotificationsEnabled(storedNotifications === "true");
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", newValue.toString());
    if (newValue) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notificationsEnabled", newValue.toString());
  };

  const resetSettings = () => {
    setDarkMode(false);
    setNotificationsEnabled(true);
    localStorage.setItem("darkMode", "false");
    localStorage.setItem("notificationsEnabled", "true");
    document.body.classList.remove("dark");
  };

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
        <button className={styles.resetButton} onClick={resetSettings}>
          Reset Settings to Default
        </button>
      </div>
    </div>
  );
};

export default Settings;
