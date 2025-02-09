"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import styles from "./dashboard.module.css";
import {
  Home,
  DollarSign,
  Settings,
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
import Expenses from "./Expenses";
import Planner from "./planner";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [firstName, setFirstName] = useState("");
  const [transactions, setTransactions] = useState([]); // Store API transactions
  const [loadingTransactions, setLoadingTransactions] = useState(true);

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
        console.log("🔍 Transactions received:", data); // Debugging step

        // ✅ Fix: Extract transactions array correctly
        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setTransactions([]); // Prevent state issues
        }
      } catch (error) {
        console.error("🔥 Error fetching transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "budget", label: "Budget", icon: BudgetIcon },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "planner", label: "Planner", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Budget Data for Pie Chart
  const budgetData = [
    { name: "Spent", value: 187.85, color: "#FF5733" },
    { name: "Remaining", value: 312.15, color: "#28A745" },
  ];

  // Spending Breakdown Pie Chart Data
  const spendingData = [
    { name: "Groceries", value: 85.5, color: "#3498DB" },
    { name: "Restaurants", value: 32.4, color: "#E67E22" },
    { name: "Coffee", value: 4.75, color: "#8E44AD" },
    { name: "Other", value: 65.2, color: "#F1C40F" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} />;
      case "budget":
        return <Budget />;
      case "expenses":
        return <Expenses />;
      case "planner":
        return <Planner />;
      default:
        return (
          <>
            <div className={styles.gridContainer}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Budget Overview</h2>
                </div>
                <p className={styles.amount}>$500.00</p>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={budgetData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {budgetData.map((entry, index) => (
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
                  <h2 className={styles.cardTitle}>Spending Breakdown</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {spendingData.map((entry, index) => (
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
              <h2 className={styles.cardTitle}>Recent Food Expenses</h2>
              {loadingTransactions ? (
                <p>Loading transactions...</p>
              ) : transactions.length > 0 ? (
                <div className={styles.transactionList}>
                  {transactions.map((transaction, index) => (
                    <div key={index} className={styles.transaction}>
                      <div className={styles.transactionInfo}>
                        <div className={styles.transactionIcon}>
                          <FastFood size={20} color="#64748b" />
                        </div>
                        <div>
                          <div>{transaction.name || "Unknown Transaction"}</div>
                          <div className={styles.userEmail}>{transaction.date || "Unknown Date"}</div>
                        </div>
                      </div>
                      <span className={`${styles.transactionAmount} ${styles.expense}`}>
                        ${transaction.amount ? Math.abs(transaction.amount).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent food transactions found.</p>
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

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.welcomeText}>Welcome Back{firstName ? `, ${firstName}` : ""}</h1>
          {user && <p className={styles.userEmail}>{user.email}</p>}
          <button onClick={() => signOut(auth)} className={styles.logoutButton}>
            Logout
          </button>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}
