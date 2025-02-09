import styles from "./RestaurantDetails.module.css"

export default function RestaurantDetails({ restaurant, onClose }) {
  return (
    <div className={styles.details}>
      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
      <h2>{restaurant.name}</h2>
      <p>Price: ${restaurant.price}</p>
      {/* Add more details as needed */}
    </div>
  )
}

