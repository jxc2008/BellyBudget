"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import RestaurantDetails from "./RestaurantDetails"
import styles from "./Map.module.css"
import axios from "axios"

const GEOAPIFY_API_KEY = "9182062136cc42f39ecfd41ada924841"

async function getCoordinates(address: string) {
  const encodedAddress = encodeURIComponent(address)
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${GEOAPIFY_API_KEY}`

  try {
    const response = await axios.get(url)
    const results = response.data.features

    if (results.length > 0) {
      const [lon, lat] = results[0].geometry.coordinates // Note the order: [longitude, latitude]
      return { lat, lng: lon } // Return as {lat, lng} for Google Maps
    } else {
      console.error("No results found for address:", address)
      return null
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error)
    return null
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function Map() {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    const loadMap = async () => {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: "weekly",
      })

      try {
        const google = await loader.load()
        const mapOptions = {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
        }

        const newMap = new google.maps.Map(mapRef.current, mapOptions)
        setMap(newMap)
        console.log("Map Object:", newMap) // Debugging

        const response = await axios.get("http://localhost:3001/restaurants")
        const restaurants = response.data

        for (const restaurant of restaurants) {
          const address = restaurant.vicinity
          const coordinates = await getCoordinates(address)

          if (coordinates) {
            console.log(`Coordinates for ${restaurant.name}:`, coordinates) // Debugging

            const marker = new google.maps.Marker({
              position: coordinates,
              map: newMap,
              title: restaurant.name,
            })

            marker.addListener("click", () => {
              setSelectedRestaurant(restaurant)
            })
          } else {
            console.error(`Failed to get coordinates for: ${address}`)
          }
        }
      } catch (error) {
        console.error("Error loading map or fetching restaurants:", error)
      }
    }

    loadMap()
  }, [])

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
      {selectedRestaurant && (
        <RestaurantDetails restaurant={selectedRestaurant} onClose={() => setSelectedRestaurant(null)} />
      )}
    </div>
  )
}

