import { MongoClient } from "mongodb";
import axios from "axios";
import dotenv from "dotenv";
import config from "./config.js";
import express from "express";

dotenv.config(); // Load environment variables

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = "HackNYU";
const COLLECTION_NAME = "Restaurants";


async function findNearbyRestaurants(lat, lng, radius, budget, n) {
  try {
    console.log("🔄 Fetching restaurants from Google API...");

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=AIzaSyDxHRAT9nQjGafq0G65vhpYne0Krf2oJA8`
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
    const avgBudget = budget / (7*n);
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

    
    resultList = resultList.sort((a, b) => b.score - a.score);

    return selectRestaurants(resultList, 7*n, budget); 
}
catch(error){
  console.log("error");
}
}
export { findNearbyRestaurants };


function selectRestaurants(restaurants, targetCount, totalBudget) {
  // Specific estimated costs for price levels
  const priceEstimates = {
    0: 5,   
    1: 10,  
    2: 20,  
    3: 35,  
    4: 60,  
    5: 100  
  };


  restaurants.forEach(restaurant => {
    const priceLevel = restaurant.price_level || 0;
    restaurant.estimated_cost = priceEstimates[priceLevel] || 25;
  });


  const scoreSortedRestaurants = [...restaurants].sort((a, b) => b.score - a.score);
  let selected = [];
  let remainingBudget = totalBudget;


  for (const restaurant of scoreSortedRestaurants) {
    if (selected.length >= targetCount) break;
    
    if (restaurant.estimated_cost <= remainingBudget) {
      selected.push(restaurant);
      remainingBudget -= restaurant.estimated_cost;
    }
  }
  
  if (selected.length < targetCount) {
    const cheapSortedRestaurants = [...restaurants]
      .filter(r => !selected.includes(r))
      .sort((a, b) => a.estimated_cost - b.estimated_cost);

    for (const restaurant of cheapSortedRestaurants) {
      if (selected.length >= targetCount) break;
      remainingBudget -= restaurant.estimated_cost;
      selected.push(restaurant);
    }
  }
  return selected;
}