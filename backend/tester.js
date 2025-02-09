import { restaurantService } from "./services.js";
import dotenv from "dotenv";
dotenv.config();


const restaurantsNear = restaurantService.findNearbyRestaurants(40.7359, -73.9911, 1000);
// Example: UMD College Park
console.log(restaurantsNear);