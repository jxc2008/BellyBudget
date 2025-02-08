// routes.js
const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

// Route for fetching nearby restaurants
router.get('/restaurants', controllers.getRestaurants);

// Route for connecting a bank account
router.post('/users/connect-bank', controllers.connectBank);

// Route for setting a user budget
router.post('/users/budget', controllers.setBudget);

// Route for retrieving a meal plan
router.get('/users/mealplan', controllers.getMealPlan);

module.exports = router;