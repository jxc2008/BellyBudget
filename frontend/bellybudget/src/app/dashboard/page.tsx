"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import styles from "./dashboard.module.css"
import {
  Home,
  PieChart,
  DollarSign,
  Settings,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Coffee,
  PizzaIcon as FastFood,
  ShoppingBag,
} from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth")
      } else {
        setUser(currentUser)
      }
    })

    return () => unsubscribe()
  }, [router])

  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "budget", label: "Budget", icon: PieChart },
    { id: "expenses", label: "Expenses", icon: DollarSign },
    { id: "calendar", label: "Meal Calendar", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const recentTransactions = [
    { id: 1, name: "Grocery Shopping", amount: -85.5, icon: ShoppingCart, date: "Today" },
    { id: 2, name: "Restaurant", amount: -32.4, icon: FastFood, date: "Yesterday" },
    { id: 3, name: "Coffee Shop", amount: -4.75, icon: Coffee, date: "Yesterday" },
    { id: 4, name: "Supermarket", amount: -65.2, icon: ShoppingBag, date: "2 days ago" },
  ]

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
            <h1 className={styles.welcomeText}>Welcome Back!</h1>
            {user && <p className={styles.userEmail}>{user.email}</p>}
          </div>
          <button onClick={() => signOut(auth)} className={styles.logoutButton}>
            Logout
          </button>
        </header>

        <div className={styles.gridContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Monthly Budget</h2>
              <TrendingUp size={20} color="#64748b" />
            </div>
            <p className={styles.amount}>$500.00</p>
            <div className={styles.chart}>Budget visualization coming soon</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Spent This Month</h2>
              <DollarSign size={20} color="#64748b" />
            </div>
            <p className={styles.amount}>$187.85</p>
            <div className={styles.chart}>Spending visualization coming soon</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Remaining Budget</h2>
              <PieChart size={20} color="#64748b" />
            </div>
            <p className={styles.amount}>$312.15</p>
            <div className={styles.chart}>Remaining budget visualization coming soon</div>
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
      </main>
    </div>
  )
}

