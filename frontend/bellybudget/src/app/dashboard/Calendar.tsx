"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBudget } from "@/contexts/BudgetContext";
import styles from './Calendar.module.css';

interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface WeeklyPlan {
  [key: string]: MealPlan;
}

interface BudgetContextType {
  weeklyPlan: WeeklyPlan;
  updateWeeklyPlan: (day: string, mealType: string, value: string) => void;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { weeklyPlan } = useBudget() as BudgetContextType;

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const getMealPlan = useCallback((date: Date): MealPlan => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return weeklyPlan[dayOfWeek] || { breakfast: '', lunch: '', dinner: '' };
  }, [weeklyPlan]);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const generateCalendarDays = useCallback(() => {
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={styles.emptyDay} aria-hidden="true" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const mealPlan = getMealPlan(date);
      const hasMeals = mealPlan.breakfast || mealPlan.lunch || mealPlan.dinner;

      days.push(
        <div
          key={day}
          className={`${styles.day} ${isToday ? styles.today : ''} 
                     ${isSelected ? styles.selected : ''} 
                     ${hasMeals ? styles.hasMeals : ''}`}
          onClick={() => setSelectedDate(date)}
          role="button"
          tabIndex={0}
          aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${
            hasMeals ? ', has meals planned' : ''
          }`}
          aria-selected={isSelected}
        >
          <span className={styles.dayNumber}>{day}</span>
          {hasMeals && (
            <div className={styles.mealIndicators} aria-hidden="true">
              {mealPlan.breakfast && (
                <div 
                  className={styles.mealDot} 
                  data-meal="breakfast" 
                  title="Breakfast planned"
                />
              )}
              {mealPlan.lunch && (
                <div 
                  className={styles.mealDot} 
                  data-meal="lunch" 
                  title="Lunch planned"
                />
              )}
              {mealPlan.dinner && (
                <div 
                  className={styles.mealDot} 
                  data-meal="dinner" 
                  title="Dinner planned"
                />
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  }, [currentDate, selectedDate, startingDay, daysInMonth, getMealPlan]);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button 
          onClick={previousMonth} 
          className={styles.navigationButton}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.monthYear}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={nextMonth} 
          className={styles.navigationButton}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.weekdays} role="row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.weekday} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className={styles.days} role="grid">
        {generateCalendarDays()}
      </div>

      {selectedDate && (
        <div className={styles.selectedDateMeals}>
          <h3 className={styles.selectedDateTitle}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className={styles.mealsList}>
            {Object.entries(getMealPlan(selectedDate)).map(([meal, plan]) => (
              <div key={meal} className={styles.mealItem}>
                <span className={styles.mealType}>
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </span>
                <span className={styles.mealPlan}>
                  {plan || 'No meal planned'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;