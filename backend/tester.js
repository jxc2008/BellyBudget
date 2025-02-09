import { restaurantService } from "./services.js";
import dotenv from "dotenv";
dotenv.config();


let restaurantsNear = restaurantService.findNearbyRestaurants(40.7359, -73.9911, 1000);
// Example: UMD College Park