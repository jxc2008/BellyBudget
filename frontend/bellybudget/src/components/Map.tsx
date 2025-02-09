"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import RestaurantDetails from "./RestaurantDetails"
import styles from "./Map.module.css"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function Map() {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
    })

    loader.load().then(() => {
      const mapOptions = {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [{ saturation: -100 }, { lightness: 50 }],
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
      }

      const newMap = new google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      // Hide the Google Maps attribution
      const removeGoogleLabels = () => {
        const labels = document.getElementsByClassName("gmnoprint")
        for (let i = 0; i < labels.length; i++) {
          labels[i].style.display = "none"
        }
        const googleLink = document.getElementsByClassName("gm-style-cc")
        for (let i = 0; i < googleLink.length; i++) {
          googleLink[i].style.display = "none"
        }
        const googleLogo = document.querySelector('a[href^="https://maps.google.com/maps"]')
        if (googleLogo) {
          googleLogo.style.display = "none"
        }
      }

      // Call the function to remove labels after a short delay to ensure the map has loaded
      setTimeout(removeGoogleLabels, 100)

      // Add markers for restaurants (mock data)
      const restaurants = [
        { id: 1, name: "Restaurant A", lat: 40.7128, lng: -74.006, price: 15 },
        { id: 2, name: "Restaurant B", lat: 40.7158, lng: -74.009, price: 25 },
        // Add more restaurants...
      ]

      restaurants.forEach((restaurant) => {
        const marker = new google.maps.Marker({
          position: { lat: restaurant.lat, lng: restaurant.lng },
          map: newMap,
          title: restaurant.name,
        })

        marker.addListener("click", () => {
          setSelectedRestaurant(restaurant)
        })
      })
    })
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

