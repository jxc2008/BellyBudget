"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import styles from "./dashboard.module.css";
import {
  Home,
  PieChart as PieChartIcon,
  DollarSign,
  Settings,
  Calendar,
  Coffee,
  User,
  PizzaIcon as FastFood,
  ShoppingBag,
} from "lucide-react";

// Import Recharts
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Import the Profile component that accepts a user prop
import Profile from "./Profile";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [firstName, setFirstName] = useState("");

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

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "budget", label: "Budget", icon: PieChartIcon },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "calendar", label: "Meal Calendar", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const recentTransactions = [
    { id: 1, name: "Grocery Shopping", amount: -85.5, icon: ShoppingBag, date: "Today" },
    { id: 2, name: "Restaurant", amount: -32.4, icon: FastFood, date: "Yesterday" },
    { id: 3, name: "Coffee Shop", amount: -4.75, icon: Coffee, date: "Yesterday" },
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
                    <Pie
                      data={budgetData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
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
                    <Pie
                      data={spendingData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
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

            <div className={styles.recentTransactions}>
              <h2 className={styles.cardTitle}>Recent Food Expenses</h2>
              <div className={styles.transactionList}>
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transaction}>
                    <div className={styles.transactionInfo}>
                      <div className={styles.transactionIcon}>
                        <transaction.icon size={20} color="#64748b" />
                      </div>
                      <div>
                        <div>{transaction.name}</div>
                        <div className={styles.userEmail}>{transaction.date}</div>
                      </div>
                    </div>
                    <span className={`${styles.transactionAmount} ${styles.expense}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
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
          <div>
            <h1 className={styles.welcomeText}>
              Welcome Back{firstName ? `, ${firstName}` : ""}
            </h1>
            {user && <p className={styles.userEmail}>{user.email}</p>}
          </div>
          <button onClick={() => signOut(auth)} className={styles.logoutButton}>
            Logout
          </button>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
