import { restaurantService } from "./services.js";
import dotenv from "dotenv";
dotenv.config();


let results = await restaurantService.findNearbyRestaurants(40.7359, -73.9911, 1000);
let filterResults = [];
results = results.forEach(restaurant => {
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
  
