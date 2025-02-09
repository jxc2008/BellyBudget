// services.js
const { Restaurant, Budget } = await import('./models.js');
import axios from "axios";
import config from "./config.js";
import { MongoClient } from 'mongodb';

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
    let filterResults = [];
    console.log(typeof resultList);
    resultList.forEach(restaurant => {
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
    console.log("print");
    console.log(typeof filterResults);
    filterResults = filterResults.map(restaurant => {
      restaurant.score = (Math.pow(restaurant.rating, 2) / restaurant.price_level) * Math.log(1 + parseInt(restaurant.user_ratings_total));
    });
    storeEachRestaurant(resultList);
    resultList = resultList.sort((a, b) => b.score - a.score);

    resultList = resultList.slice(0,10);


    console.log(typeof resultList);
    return resultList;
  }catch{
    console.error("error: ");
  }

  async function storeEachRestaurant(restaurants) {
    console.log("print");
    const client = new MongoClient(process.env.MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    } );

    try {
        await client.connect();
        const db = client.db("HackNYU");
        const collection = db.collection("Restaurants");

        // Insert each restaurant individually
        for (const restaurant of restaurants) {
            await collection.insertOne(restaurant);
            console.log(`Inserted: ${restaurant.name}`);
        }
    } catch (error) {
        console.error("MongoDB Error:", error);
    } finally {
        await client.close();
    }
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
