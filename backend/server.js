import express from 'express';
import cors from 'cors';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import dotenv from "dotenv";
import services from "./services.js"
dotenv.config();// Load environment variables

const app = express();
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Enable JSON parsing

const PORT = process.env.PORT || 3001;

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
        client_id: '67a80110096bf90022958d1d',
        secret: 'c22769191be5a8ba5cc418ad66b6d3',
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
    const transactionArray = [];

    for (const [index, transaction] of allTransactions.entries()) {
        transactionArray.push(transaction);
    }
    return transactionArray;
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    throw error;
  }
}

// Create an API endpoint for transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await fetchFullTransactionHistory();
    res.json({transactions});
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/restaurants', async (req, res) => {
  const jsonData = await services.findNearbyRestaurants(40.75, -73.98, 1000);
  res.json(jsonData);
});

app.listen(3001, () => console.log('Server running on port 3001'));
// Start the Express server

app.get('/schedule', async (req, res) => {
  const restaurants = await services.findNearbyRestaurants(40.7359, -73.9911, 1000, 500, 2);
  res.json(restaurants);
});