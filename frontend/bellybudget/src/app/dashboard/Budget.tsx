"use client"

import type React from "react"
import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { PlusCircle, MinusCircle } from "lucide-react"
import styles from "./dashboard.module.css"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const initialBudgetData = [
  { name: "Groceries", budget: 300, spent: 250 },
  { name: "Dining Out", budget: 200, spent: 180 },
  { name: "Snacks", budget: 50, spent: 30 },
  { name: "Beverages", budget: 100, spent: 75 },
  { name: "Miscellaneous", budget: 50, spent: 20 },
]

const Budget: React.FC = () => {
  const [budgetData, setBudgetData] = useState(initialBudgetData)
  const [newCategory, setNewCategory] = useState("")
  const [newBudget, setNewBudget] = useState("")

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0)

  const handleAddCategory = () => {
    if (newCategory && newBudget) {
      setBudgetData([...budgetData, { name: newCategory, budget: Number(newBudget), spent: 0 }])
      setNewCategory("")
      setNewBudget("")
    }
  }

  const handleRemoveCategory = (index: number) => {
    const newData = [...budgetData]
    newData.splice(index, 1)
    setBudgetData(newData)
  }

  return (
    <div className={styles.budgetContainer}>
      <h2 className={styles.sectionTitle}>Budget Overview</h2>

      <div className={styles.budgetSummary}>
        <div className={styles.card}>
          <h3>Total Budget</h3>
          <p className={styles.amount}>${totalBudget.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Total Spent</h3>
          <p className={styles.amount}>${totalSpent.toFixed(2)}</p>
        </div>
        <div className={styles.card}>
          <h3>Remaining</h3>
          <p className={styles.amount}>${(totalBudget - totalSpent).toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.budgetCharts}>
        <div className={styles.pieChartContainer}>
          <h3>Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                dataKey="budget"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.barChartContainer}>
          <h3>Budget vs. Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.budgetCategories}>
        <h3>Budget Categories</h3>
        <table className={styles.budgetTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.budget.toFixed(2)}</td>
                <td>${item.spent.toFixed(2)}</td>
                <td>${(item.budget - item.spent).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemoveCategory(index)} className={styles.removeButton}>
                    <MinusCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.addCategory}>
        <h3>Add New Category</h3>
        <div className={styles.addCategoryForm}>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={styles.input}
          />
          <input
            type="number"
            placeholder="Budget Amount"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleAddCategory} className={styles.addButton}>
            <PlusCircle size={16} />
            Add Category
          </button>
        </div>
      </div>
    </div>
  )
}

export default Budget

