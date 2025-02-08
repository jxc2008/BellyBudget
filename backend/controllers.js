// controllers.js
const { restaurantService, bankService, budgetService } = require('./services');

// GET /restaurants?lat=...&lng=...&radius=...
exports.getRestaurants = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
      return res.status(400).json({ error: 'Missing query parameters: lat, lng, and radius are required.' });
    }
    const restaurants = await restaurantService.findNearbyRestaurants(lat, lng, radius);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /users/connect-bank
exports.connectBank = async (req, res) => {
  try {
    const { userId, bankCredentials } = req.body; // Adjust bankCredentials structure as needed
    if (!userId || !bankCredentials) {
      return res.status(400).json({ error: 'userId and bankCredentials are required.' });
    }
    const bankData = await bankService.connectBankAccount(userId, bankCredentials);
    res.json(bankData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /users/budget
exports.setBudget = async (req, res) => {
  try {
    const { userId, weeklyBudget } = req.body;
    if (!userId || !weeklyBudget) {
      return res.status(400).json({ error: 'userId and weeklyBudget are required.' });
    }
    const budget = await budgetService.setUserBudget(userId, weeklyBudget);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/mealplan?userId=...
exports.getMealPlan = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required.' });
    }
    const mealPlan = await budgetService.generateMealPlan(userId);
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};