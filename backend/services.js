import { MongoClient } from "mongodb";
import axios from "axios";
import dotenv from "dotenv";
import config from "./config.js";
import express from "express";

dotenv.config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "HackNYU";
const COLLECTION_NAME = "Restaurants";


async function findNearbyRestaurants(lat, lng, radius) {
  try {
    console.log("🔄 Fetching restaurants from Google API...");

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.75,-73.98&radius=2000&type=restaurant&key=AIzaSyDxHRAT9nQjGafq0G65vhpYne0Krf2oJA8`
    );

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      console.error("❌ No results from Google API.");
      return [];
    }

    let resultList = response.data.results.map((restaurant) => ({
      name: restaurant.name || "Unknown",
      opening_hours: restaurant.opening_hours?.open_now || false,
      price_level: restaurant.price_level || 0,
      rating: restaurant.rating || 0,
      scope: restaurant.scope || "unknown",
      vicinity: restaurant.vicinity || "Unknown",
      user_ratings_total: restaurant.user_ratings_total || 1,
    }));

    console.log(`📌 Fetched ${resultList.length} restaurants.`);

    if (resultList.length === 0) {
      console.error("❌ Error: No valid restaurant data to process.");
      return [];
    }

    // Calculate restaurant scores
    resultList.forEach((restaurant) => {
      restaurant.score =
        (Math.pow(restaurant.rating, 2) / (restaurant.price_level || 1)) *
        Math.log(1 + parseInt(restaurant.user_ratings_total));
    });

    // Sort by score and pick the top 10
    resultList = resultList.sort((a, b) => b.score - a.score).slice(0, 10);

    console.log("📌 Final Top 10 Restaurants:", resultList);

    // Optionally, store the fetched restaurants in MongoDB
    // await storeRestaurants(resultList);

    return resultList; // Return the top 10 restaurants
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    return [];
  }
}

// Store the restaurant data in MongoDB
async function storeRestaurants(restaurants) {
  if (!MONGODB_URI) {
    console.error("MongoDB URI is missing. Check your .env file.");
    return;
  }

  const client = new MongoClient(MONGODB_URI, { tls: true });

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log("📌 Data being stored in MongoDB:", restaurants);
    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      console.error("❌ Error: restaurants is not a valid array!");
      return;
    }

    for (const restaurant of restaurants) {
      // Check if the restaurant already exists by `name + vicinity`
      const existingRestaurant = await collection.findOne({
        name: restaurant.name,
        vicinity: restaurant.vicinity,
      });

      if (existingRestaurant) {
        console.log(`🔄 Skipping duplicate: ${restaurant.name} (${restaurant.vicinity})`);
      } else {
        // Insert only if it does not exist
        await collection.insertOne(restaurant);
        console.log(`✅ Inserted: ${restaurant.name} (${restaurant.vicinity})`);
      }
    }
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  } finally {
    await client.close();
  }
}
// Test function call
const restaurants = await findNearbyRestaurants(40.75, -73.98, 1000);
console.log ("📌 Final Restaurants Output:", restaurants); 

const app = express();



export default{ findNearbyRestaurants };