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
import styles from "./Budget.module.css";

type BudgetProps = {
  transactions?: any[];
  loadingTransactions?: boolean;
  budget?: number; // This is your weekly food budget
};

const Budget: React.FC<BudgetProps> = ({
  transactions = [],
  loadingTransactions = false,
  budget = 500,
}) => {
  // --- State for time filter: "weekly", "monthly", or "yearly" ---
  const [timeFilter, setTimeFilter] = useState("weekly");

  // --- State for computed metrics and filtered transactions ---
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [dailySpending, setDailySpending] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  // --- Helper: Parse a transaction’s date (handle seconds vs. milliseconds) ---
  const parseTransactionDate = (dateInput: string | number): Date => {
    let timestamp: number;
    if (typeof dateInput === "number") {
      // If the number is less than 10 digits, assume seconds.
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
      "coffee",
      "cafe",
      "restaurant",
      "burger",
      "pizza",
      "bakery",
      "diner",
      "fast food",
      "starbucks",
      "mcdonald's",
      "subway",
      "kfc",
      "taco",
      "sushi",
      "grill",
      "bistro",
      "delivery",
      "takeout",
      "meal",
      "food",
      "eat",
      "dining",
    ];
    return foodKeywords.some((keyword) =>
      transactionName.toLowerCase().includes(keyword)
    );
  };

  // --- Filter only food transactions ---
  // If a transaction has a category array, we check if it includes "groceries".
  // Otherwise, we check if the name includes a food keyword.
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
  // "weekly": past 7 days, "monthly": past 30 days, "yearly": past 365 days.
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

  // --- Define period length (in days) ---
  let periodDays: number;
  if (timeFilter === "weekly") {
    periodDays = 7;
  } else if (timeFilter === "monthly") {
    periodDays = 30;
  } else {
    periodDays = 365;
  }

  // --- Compute metrics ---
  let remainingAmount = 0;
  let budgetUsedPercent = 0;
  const dailyAverage = periodDays > 0 ? totalSpent / periodDays : 0;
  if (timeFilter === "weekly") {
    remainingAmount = budget - totalSpent;
    budgetUsedPercent = budget > 0 ? (totalSpent / budget) * 100 : 0;
  }

  return (
    <div className={styles.budgetContainer}>
      <h2 className={styles.sectionTitle}>Food Budget Overview</h2>

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
              <p className={styles.amount}>${budget.toFixed(2)}</p>
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

      {/* For Weekly view, display a progress bar */}
      {timeFilter === "weekly" && (
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${budgetUsedPercent}%` }}
          ></div>
          <span className={styles.progressLabel}>
            {budgetUsedPercent.toFixed(0)}% of your weekly budget spent
          </span>
        </div>
      )}

      {/* Enlarged Daily Spending Trend Graph */}
      <div className={styles.chartsSection}>
        <div className={styles.lineChartContainer}>
          <h3>Daily Spending Trend</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailySpending}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Spent" />
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
    </div>
  );
};

export default Budget;
