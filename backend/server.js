const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Enable JSON parsing

const PORT = process.env.PORT || 4000;

// Configure Plaid API
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Change to production if needed
});
const client = new PlaidApi(configuration);

// Environment variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const ACCESS_TOKEN = 'access-sandbox-0877fa6b-65b1-4ffe-b293-e67252e87ef9'; // Replace with your actual access token

// Function to fetch historical transactions
async function fetchFullTransactionHistory() {
  let cursor = null;
  let allTransactions = [];

  try {
    while (true) {
      const request = {
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        access_token: ACCESS_TOKEN,
        cursor: cursor,
      };

      const response = await client.transactionsSync(request);
      const { added, next_cursor, has_more } = response.data;

      // Append new transactions to the array
      allTransactions = allTransactions.concat(added);

      // Update cursor for next request
      cursor = next_cursor;

      console.log(`Fetched ${added.length} transactions. Total so far: ${allTransactions.length}`);

      // Stop fetching if there are no more transactions
      if (!has_more) break;
    }

    return allTransactions;
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    throw error;
  }
}

// Function to filter only food-related transactions
function filterFoodTransactions(transactions) {
  const foodKeywords = ['restaurant', 'food', 'grocery', 'cafe', 'coffee', 'dining', 'supermarket'];

  return transactions.filter((transaction) => {
    const category = transaction.category ? transaction.category.join(" ").toLowerCase() : "";
    return foodKeywords.some((keyword) => category.includes(keyword));
  });
}

// Create an API endpoint for transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await fetchFullTransactionHistory();
    const foodTransactions = filterFoodTransactions(transactions); // Apply filtering
    res.json({ transactions: foodTransactions });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
