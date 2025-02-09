"use client"

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlusCircle } from 'lucide-react';
import styles from './dashboard.module.css';

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
}

const initialExpenses: Expense[] = [
  { id: 1, date: '2023-05-01', category: 'Groceries', amount: 85.5, description: 'Weekly grocery shopping' },
  { id: 2, date: '2023-05-02', category: 'Dining Out', amount: 32.4, description: 'Lunch with colleagues' },
  { id: 3, date: '2023-05-03', category: 'Snacks', amount: 5.75, description: 'Coffee and pastry' },
  { id: 4, date: '2023-05-04', category: 'Groceries', amount: 65.2, description: 'Restocking pantry' },
];

const categories = ['Groceries', 'Dining Out', 'Snacks', 'Beverages', 'Miscellaneous'];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: '',
    category: '',
    amount: 0,
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    setExpenses([...expenses, { id, ...newExpense }]);
    setNewExpense({ date: '', category: '', amount: 0, description: '' });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const chartData = categories.map(category => ({
    name: category,
    amount: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <div className={styles.expensesContainer}>
      <h2 className={styles.sectionTitle}>Expenses</h2>

      <div className={styles.expensesSummary}>
        <div className={styles.card}>
          <h3>Total Expenses</h3>
          <p className={styles.amount}>${totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.expensesChart}>
        <h3>Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.expensesList}>
        <h3>Recent Expenses</h3>
        <table className={styles.expensesTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.addExpense}>
        <h3>Add New Expense</h3>
        <form onSubmit={handleSubmit} className={styles.addExpenseForm}>
          <input
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            required
            className={styles.input}
          />
          <select
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            required
            className={styles.input}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            value={newExpense.amount || ''}
            onChange={handleInputChange}
            placeholder="Amount"
            required
            step="0.01"
            min="0"
            className={styles.input}
          />
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className={styles.input}
          />
          <button type="submit" className={styles.addButton}>
            <PlusCircle size={16} />
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
