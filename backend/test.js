const axios = require('axios');
const config = require('./config.js');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
});
const client = new PlaidApi(configuration);

const accessToken = 'access-sandbox-0877fa6b-65b1-4ffe-b293-e67252e87ef9'; // Replace with your actual access token

async function fetchTransactions(cursor = null) {
  try {
    const request = {
      client_id: "67a80110096bf90022958d1d",
      secret: 'c22769191be5a8ba5cc418ad66b6d3',
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

fetchTransactions();