import axios from "axios";
import config from './config.js'
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
});
const client = new PlaidApi(configuration);

const accessToken = 'access-sandbox-0877fa6b-65b1-4ffe-b293-e67252e87ef9'; // Replace with your actual access token

async function fetchTransactions(cursor = null) {
  try {
    const request = {
      client_id: PLAID_ID,
      secret: PLAID,
      access_token: accessToken,
      cursor: cursor,
    };
    const response = await client.transactionsSync(request);
    const { added, modified, removed, next_cursor } = response.data;

    // Process the added, modified, and removed transactions as needed
    console.log('Added transactions:', added);
    console.log('Modified transactions:', modified);
    console.log('Removed transactions:', removed);

    // Store the next_cursor to fetch updates in subsequent calls
    return next_cursor;
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
  }
}



async function fetchFullTransactionHistory() {
  let cursor = null;
  let allTransactions = [];

  try {
    while (true) {
      const request = {
        client_id: String(config.PLAID_ID),
        secret: String(config.PLAID),
        access_token: accessToken,
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

    console.log('Total Historical Transactions:', allTransactions.length);
    return allTransactions;
  } catch (error) {
    console.error('Error fetching historical transactions:', error.response?.data || error.message);
  }
}


const transact = await fetchFullTransactionHistory();
console.log(transact);