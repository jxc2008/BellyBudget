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
    let resultList = response.data.results;
    resultList = results.forEach(restaurant => {
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
    return resultList;
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

export{restaurantService};
