"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import styles from "./dashboard.module.css";
import {
  Home,
  // DollarSign,  <-- if unused, remove it
  Settings, // This is the Settings icon from lucide-react.
  Calendar,
  User,
  ShoppingBag,
  PizzaIcon as FastFood,
  Coffee,
  PocketIcon as BudgetIcon,
} from "lucide-react";

// Import Recharts components
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Import components
import Profile from "./Profile";
import Budget from "./Budget";
import Planner from "./planner";
// Import your settings page as a different name to avoid conflict:
import SettingsPage from "./Settings";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [firstName, setFirstName] = useState("");
  const [transactions, setTransactions] = useState([]); // Store API transactions
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [spendingData, setSpendingData] = useState([]); // Pie chart data

  // Budget-related state
  const [budget, setBudget] = useState(500); // Total budget
  const [spent, setSpent] = useState(187.85); // Amount spent
  const [remaining, setRemaining] = useState(budget - spent); // Remaining budget

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName || "");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ Fetch transactions from /transactions API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:4000/transactions"); // Ensure correct backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log("🔍 Transactions received:", data);

        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          processSpendingData(data.transactions); // ✅ Update Pie Chart Data
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setTransactions([]);
          setSpendingData([]);
        }
      } catch (error) {
        console.error("🔥 Error fetching transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  // ✅ Intelligent food detection logic
  const isFoodRelated = (transactionName) => {
    // Common food-related terms (can be expanded)
    const foodKeywords = [
      "coffee", "cafe", "restaurant", "burger", "pizza", "bakery", "diner",
      "fast food", "starbucks", "mcdonald's", "subway", "kfc", "taco", "sushi",
      "grill", "bistro", "delivery", "takeout", "meal", "food", "eat", "dining"
    ];

    // Normalize the transaction name for comparison
    const normalizedName = transactionName.toLowerCase();

    // Check if the transaction name contains any food-related keyword
    return foodKeywords.some((keyword) => normalizedName.includes(keyword));
  };

  // ✅ Process transactions into categories for Spending Breakdown Pie Chart
  const processSpendingData = (transactions) => {
    const categoryMap = {
      Groceries: 0,
      Restaurants: 0,
      Coffee: 0,
      Other: 0,
    };

    transactions.forEach((transaction) => {
      const transactionName = transaction.name?.toLowerCase() || "";

      if (transaction.category.includes("Groceries")) {
        categoryMap.Groceries += Math.abs(transaction.amount);
      } else if (isFoodRelated(transactionName)) {
        // Categorize based on transaction name
        if (transactionName.includes("coffee") || transactionName.includes("starbucks")) {
          categoryMap.Coffee += Math.abs(transaction.amount);
        } else if (transactionName.includes("restaurant") || transactionName.includes("dining")) {
          categoryMap.Restaurants += Math.abs(transaction.amount);
        } else {
          // Default to "Restaurants" for other food-related transactions
          categoryMap.Restaurants += Math.abs(transaction.amount);
        }
      } else {
        categoryMap.Other += Math.abs(transaction.amount);
      }
    });

    setSpendingData([
      { name: "Groceries", value: categoryMap.Groceries, color: "#3498DB" },
      { name: "Restaurants", value: categoryMap.Restaurants, color: "#E67E22" },
      { name: "Coffee", value: categoryMap.Coffee, color: "#8E44AD" },
      { name: "Other", value: categoryMap.Other, color: "#F1C40F" },
    ]);
  };

  // ✅ Budget pie chart data for the overview (Left Pie Chart)
  // Since there were no weekly expenses, we hardcode it as $0 spent and $500 remaining.
  const getBudgetData = () => {
    return [
      { name: "Spent", value: 0, color: "#FF5733" },
      { name: "Remaining", value: 500, color: "#28A745" },
    ];
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "budget", label: "Budget", icon: BudgetIcon },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings }, // This is the Settings icon.
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} />;
      case "budget":
        return (
          <Budget
            transactions={transactions}
            loadingTransactions={loadingTransactions}
            budget={budget}
          />
        );
      case "planner":
        return <Planner />;
      case "settings":
        // Render our Settings page (imported as SettingsPage)
        return <SettingsPage />;
      default:
        return (
          <>
            <div className={styles.gridContainer}>
              {/* Budget Overview Card (Left Pie Chart) */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Budget Overview</h2>
                  <p className={styles.budgetAmount}>$500.00</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getBudgetData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {getBudgetData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Spending Breakdown Card (Right Pie Chart) */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Spending Breakdown (Food Only)</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={spendingData.filter((d) => d.name !== "Other")}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {spendingData
                        .filter((d) => d.name !== "Other")
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions Section */}
            <div className={styles.recentTransactions}>
              <h2 className={styles.cardTitle}>All Expenses</h2>
              {loadingTransactions ? (
                <p>Loading transactions...</p>
              ) : transactions.length > 0 ? (
                <div className={styles.transactionList}>
                  {transactions.map((transaction, index) => (
                    <div key={index} className={styles.transaction}>
                      <div className={styles.transactionInfo}>
                        <div className={styles.transactionIcon}>
                          {isFoodRelated(transaction.name) ? (
                            <FastFood size={20} color="#FF5733" />
                          ) : (
                            <ShoppingBag size={20} color="#64748b" />
                          )}
                        </div>
                        <div>
                          <div>{transaction.name || "Unknown Transaction"}</div>
                          <div className={styles.userEmail}>
                            {transaction.date || "Unknown Date"}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`${styles.transactionAmount} ${
                          isFoodRelated(transaction.name) ? styles.expense : ""
                        }`}
                      >
                        $
                        {transaction.amount
                          ? Math.abs(transaction.amount).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No expenses found.</p>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} className={styles.navIcon} />
            {item.label}
          </div>
        ))}
      </aside>

      <main className={styles.mainContent}>{renderContent()}</main>
    </div>
  );
}
