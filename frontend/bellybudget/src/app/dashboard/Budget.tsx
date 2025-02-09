"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { PizzaIcon as FastFood } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./Budget.module.css";

type BudgetProps = {
  transactions?: any[];
  loadingTransactions?: boolean;
};

type UserData = {
  surveyData: {
    weeklyBudget: string;
    mealsPerDay: string;
    cuisinePreferences: string[];
    dietaryRestrictions: string;
    diningPreference: string;
  };
  lastUpdated: Date;
};

const Budget: React.FC<BudgetProps> = ({
  transactions = [],
  loadingTransactions = false,
}) => {
  const [weeklyBudget, setWeeklyBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // --- State for time filter: "weekly", "monthly", or "yearly" ---
  const [timeFilter, setTimeFilter] = useState("weekly");

  // --- State for computed metrics and filtered transactions ---
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [dailySpending, setDailySpending] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setWeeklyBudget(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch and subscribe to user data from Firebase
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as UserData;
          console.log("Firebase data received:", data);
          
          // Access weeklyBudget through surveyData
          if (data?.surveyData?.weeklyBudget) {
            const budgetValue = parseInt(data.surveyData.weeklyBudget);
            console.log("Parsed budget value:", budgetValue);
            setWeeklyBudget(budgetValue);
          } else {
            console.log("No weeklyBudget found in surveyData");
            setWeeklyBudget(null);
          }
        } else {
          console.log("Document doesn't exist");
          setWeeklyBudget(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching budget:", error);
        setWeeklyBudget(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // --- Helper: Parse a transaction's date ---
  const parseTransactionDate = (dateInput: string | number): Date => {
    let timestamp: number;
    if (typeof dateInput === "number") {
      timestamp = dateInput < 10000000000 ? dateInput * 1000 : dateInput;
    } else {
      const parsed = Date.parse(dateInput);
      timestamp = !isNaN(parsed) ? parsed : new Date(dateInput).getTime();
    }
    return new Date(timestamp);
  };

  // --- Helper: Determine if a transaction is food-related ---
  const isFoodRelated = (transactionName: string): boolean => {
    const foodKeywords = [
      "coffee", "cafe", "restaurant", "burger", "pizza", "bakery",
      "diner", "fast food", "starbucks", "mcdonald's", "subway",
      "kfc", "taco", "sushi", "grill", "bistro", "delivery",
      "takeout", "meal", "food", "eat", "dining",
    ];
    return foodKeywords.some((keyword) =>
      transactionName.toLowerCase().includes(keyword)
    );
  };

  // --- Filter only food transactions ---
  const filterFoodTransactions = (txns: any[]) => {
    return txns.filter((t) => {
      if (!t.date || !t.name || !t.amount) return false;
      if (t.category && Array.isArray(t.category)) {
        if (t.category.join(" ").toLowerCase().includes("groceries"))
          return true;
      }
      return isFoodRelated(t.name);
    });
  };

  // --- Filter transactions by time period ---
  const filterTransactionsByTime = (txns: any[], filter: string) => {
    const now = new Date();
    const pastDate = new Date(now);
    if (filter === "weekly") {
      pastDate.setDate(now.getDate() - 7);
    } else if (filter === "monthly") {
      pastDate.setDate(now.getDate() - 30);
    } else if (filter === "yearly") {
      pastDate.setDate(now.getDate() - 365);
    }
    return txns.filter((t) => {
      const d = parseTransactionDate(t.date);
      return d >= pastDate && d <= now;
    });
  };

  // --- Process transactions: group by day and compute total spent ---
  const processTransactions = (txns: any[]) => {
    const dailyMap: { [key: string]: number } = {};
    let sum = 0;
    txns.forEach((t) => {
      const d = parseTransactionDate(t.date);
      const key = d.toLocaleDateString();
      dailyMap[key] = (dailyMap[key] || 0) + Math.abs(t.amount);
      sum += Math.abs(t.amount);
    });
    setTotalSpent(sum);
    const dailyData = Object.keys(dailyMap)
      .map((key) => ({ day: key, amount: dailyMap[key] }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
    setDailySpending(dailyData);
  };

  // --- Refilter and reprocess whenever transactions or timeFilter changes ---
  useEffect(() => {
    const foodTxns = filterFoodTransactions(transactions);
    const timeFilteredTxns = filterTransactionsByTime(foodTxns, timeFilter);
    setFilteredTransactions(timeFilteredTxns);
    processTransactions(timeFilteredTxns);
  }, [transactions, timeFilter]);

  // --- Calculate budget metrics ---
  let remainingAmount = 0;
  let budgetUsedPercent = 0;
  const periodDays = timeFilter === "weekly" ? 7 : timeFilter === "monthly" ? 30 : 365;
  const dailyAverage = periodDays > 0 ? totalSpent / periodDays : 0;
  
  if (timeFilter === "weekly" && weeklyBudget !== null) {
    remainingAmount = weeklyBudget - totalSpent;
    budgetUsedPercent = weeklyBudget > 0 
      ? (totalSpent / weeklyBudget) * 100 
      : 0;
  }

  if (!userId) {
    return <div className={styles.budgetContainer}>Please sign in to view your budget.</div>;
  }

  return (
    <div className={styles.budgetContainer}>
      <h2 className={styles.sectionTitle}>Food Budget Overview</h2>

      {loading ? (
        <p className="text-center">Loading budget data...</p>
      ) : weeklyBudget === null ? (
        <p className="text-center">Error loading budget data. Please try again.</p>
      ) : (
        <>
          {/* Time Filter Buttons */}
          <div className={styles.timeFilter}>
            <button
              className={timeFilter === "weekly" ? styles.activeFilter : ""}
              onClick={() => setTimeFilter("weekly")}
            >
              Weekly
            </button>
            <button
              className={timeFilter === "monthly" ? styles.activeFilter : ""}
              onClick={() => setTimeFilter("monthly")}
            >
              Monthly
            </button>
            <button
              className={timeFilter === "yearly" ? styles.activeFilter : ""}
              onClick={() => setTimeFilter("yearly")}
            >
              Yearly
            </button>
          </div>

          {/* Summary Cards */}
          <div className={styles.summaryCards}>
            {timeFilter === "weekly" ? (
              <>
                <div className={styles.card}>
                  <h3>Weekly Budget</h3>
                  <p className={styles.amount}>
                    ${weeklyBudget.toFixed(2)}
                  </p>
                </div>
                <div className={styles.card}>
                  <h3>Total Spent</h3>
                  <p className={styles.amount}>${totalSpent.toFixed(2)}</p>
                </div>
                <div className={styles.card}>
                  <h3>Remaining</h3>
                  <p className={styles.amount}>${remainingAmount.toFixed(2)}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.card}>
                  <h3>Total Spent</h3>
                  <p className={styles.amount}>${totalSpent.toFixed(2)}</p>
                </div>
                <div className={styles.card}>
                  <h3>Daily Average</h3>
                  <p className={styles.amount}>${dailyAverage.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>

          {/* Weekly Progress Bar */}
          {timeFilter === "weekly" && (
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
              ></div>
              <span className={styles.progressLabel}>
                {budgetUsedPercent.toFixed(0)}% of your weekly budget spent
              </span>
            </div>
          )}

          {/* Daily Spending Trend Graph */}
          <div className={styles.chartsSection}>
            <div className={styles.lineChartContainer}>
              <h3>Daily Spending Trend</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailySpending}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    name="Spent" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Food Transactions */}
          <div className={styles.recentTransactions}>
            <h3>Recent Food Transactions</h3>
            {loadingTransactions ? (
              <p>Loading transactions...</p>
            ) : filteredTransactions.length > 0 ? (
              <div className={styles.transactionList}>
                {filteredTransactions.map((transaction, index) => (
                  <div key={index} className={styles.transaction}>
                    <div className={styles.transactionInfo}>
                      <div className={styles.transactionIcon}>
                        <FastFood size={20} color="#64748b" />
                      </div>
                      <div>
                        <div>{transaction.name || "Unknown Transaction"}</div>
                        <div className={styles.userEmail}>
                          {transaction.date
                            ? parseTransactionDate(transaction.date).toLocaleDateString()
                            : "Unknown Date"}
                        </div>
                      </div>
                    </div>
                    <span className={`${styles.transactionAmount} ${styles.expense}`}>
                      $
                      {transaction.amount
                        ? Math.abs(transaction.amount).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent food transactions found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Budget;