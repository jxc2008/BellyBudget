"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { BudgetProvider } from "@/contexts/BudgetContext";
import styles from "./dashboard.module.css";
import { Home, Settings, Calendar as CalendarIcon, User, ShoppingBag, Pizza, Coffee, Pocket as BudgetIcon, ClipboardList } from "lucide-react";

// Import Recharts components
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Import components
import Profile from "./Profile";
import Budget from "./Budget";
import Planner from "./planner";
import CalendarView from "./Calendar";
import SettingsPage from "./Settings";

type Transaction = {
  name: string;
  amount: number;
  date: string;
  category: string[];
};

type SpendingData = {
  name: string;
  value: number;
  color: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [firstName, setFirstName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);

  // Budget-related state
  const [budget, setBudget] = useState(500);
  const [spent, setSpent] = useState(187.85);
  const [remaining, setRemaining] = useState(budget - spent);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3001/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        console.log("🔍 Transactions received:", data);

        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
          processSpendingData(data.transactions);
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

  const isFoodRelated = (transactionName: string): boolean => {
    const foodKeywords = [
      "coffee", "cafe", "restaurant", "burger", "pizza", "bakery", "diner",
      "fast food", "starbucks", "mcdonald's", "subway", "kfc", "taco", "sushi",
      "grill", "bistro", "delivery", "takeout", "meal", "food", "eat", "dining"
    ];

    const normalizedName = transactionName.toLowerCase();
    return foodKeywords.some((keyword) => normalizedName.includes(keyword));
  };

  const processSpendingData = (transactions: Transaction[]) => {
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
        if (transactionName.includes("coffee") || transactionName.includes("starbucks")) {
          categoryMap.Coffee += Math.abs(transaction.amount);
        } else if (transactionName.includes("restaurant") || transactionName.includes("dining")) {
          categoryMap.Restaurants += Math.abs(transaction.amount);
        } else {
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

  const getBudgetData = () => {
    return [
      { name: "Spent", value: spent, color: "#FF5733" },
      { name: "Remaining", value: remaining, color: "#28A745" },
    ];
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "planner", label: "Planner", icon: ClipboardList },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "budget", label: "Budget", icon: BudgetIcon },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
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
        return <SettingsPage />;
      case "calendar":
        return <CalendarView />;
      default:
        return (
          <>
            <div className={styles.gridContainer}>
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
                            <Pizza size={20} color="#FF5733" />
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
                        ${transaction.amount ? Math.abs(transaction.amount).toFixed(2) : "0.00"}
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
    <BudgetProvider>
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
    </BudgetProvider>
  );
}