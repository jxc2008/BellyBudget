// services.js
const { Restaurant, Budget } = await import('./models.js');
import axios from "axios";
import config from "./config.js";
import {response} from "express";

const restaurantService = {
  findNearbyRestaurants: async (lat, lng, radius) => {
    // Parse numbers from query parameters
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const maxDistance = parseFloat(radius); // assuming radius is in meters

    const PLACE = config.PLACE;
    
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${maxDistance}&type=restaurant&key=${config.PLACE}`;
  try {
    const response = await axios.get(url);
    return response;
    //console.log(response.data);
  }catch{
    console.error("error: ", error);
  }
    /*
    return await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: maxDistance
        }
      }
    });
    */
  }
};

const bankService = {
  connectBankAccount: async (userId, bankCredentials) => {
    // Simulate calling the Nessie API to connect a bank account.
    // In a real scenario, you would use the bankCredentials to authenticate.
    try {
      const response = await axios.post(
        `${config.NESSIE_BASE_URL}/accounts`,
        bankCredentials,
        { headers: { Authorization: `Bearer ${config.NESSIE_API_KEY}` } }
      );
      // response.data would contain bank account information.
      return response.data;
    } catch (error) {
      throw new Error('Failed to connect bank account: ' + error.message);
    }
  }
};

const budgetService = {
  setUserBudget: async (userId, weeklyBudget) => {
    // Create or update the user's budget
    let budget = await Budget.findOne({ userId });
    if (budget) {
      budget.weeklyBudget = weeklyBudget;
      budget.remainingBudget = weeklyBudget; // Reset remaining budget
    } else {
      budget = new Budget({
        userId,
        weeklyBudget,
        remainingBudget: weeklyBudget,
        weekStart: new Date()
      });
    }
    return await budget.save();
  },
  generateMealPlan: async (userId) => {
    // Generate a basic meal plan based on the user's budget.
    // In a full implementation, you would use transaction history and restaurant recommendations.
    const budget = await Budget.findOne({ userId });
    if (!budget) {
      throw new Error('Budget not set for user.');
    }

    // For demonstration, retrieve the first 5 restaurants as recommendations.
    const restaurants = await Restaurant.find().limit(5);
    return {
      weekStart: budget.weekStart,
      weeklyBudget: budget.weeklyBudget,
      remainingBudget: budget.remainingBudget,
      recommendations: restaurants
    };
  }
};

export{restaurantService, bankService, budgetService};
