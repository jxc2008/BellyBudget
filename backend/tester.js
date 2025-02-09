import { findNearbyRestaurants } from "./services.js";
import dotenv from "dotenv";
dotenv.config();

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,  // Change to development/production if needed
  clientId: process.env.PLAID_CLIENT_ID, // Use environment variables
  secret: process.env.PLAID_SECRET,
});

const plaidClient = new PlaidApi(config);

/*
async function main(){
    let results = await restaurantService.findNearbyRestaurants(40.7359, -73.9911, 1000);
    let filterResults = [];
    results = results.map(restaurant => {
        filterResults.push({
        name: restaurant.name,
        opening_hours: restaurant.opening_hours,
        price_level: restaurant.price_level,
        rating: restaurant.rating,
        scope: restaurant.scope,
        vicinity: restaurant.vicinity,
        user_ratings_total: restaurant.user_ratings_total
        });
    });
    console.log(filterResults);
}

main();
*/


let access_token = 'access-sandbox-0877fa6b-65b1-4ffe-b293-e67252e87ef9';
/*
try {
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: '2024-01-01',
      end_date: '2024-02-01',
      options: { count: 10, offset: 0 }
    });

    console.log(response.data.transactions);
  } catch (error) {
   console.error(error);
  }
*/
const restaurants = await findNearbyRestaurants(40.7359, -73.9911, 1000, 500, 2);
console.log(restaurants);


  
