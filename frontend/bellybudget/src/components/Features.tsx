import styles from "./Features.module.css"

const Features = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Why Choose BellyBudget?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>Budget-Friendly</h3>
            <p className={styles.featureDescription}>Plan meals that fit your budget without compromising on taste.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🥗</div>
            <h3 className={styles.featureTitle}>Healthy Options</h3>
            <p className={styles.featureDescription}>
              Discover nutritious recipes that keep you healthy and satisfied.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⏱️</div>
            <h3 className={styles.featureTitle}>Time-Saving</h3>
            <p className={styles.featureDescription}>Efficiently plan your meals and grocery shopping in advance.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🍽️</div>
            <h3 className={styles.featureTitle}>Personalized</h3>
            <p className={styles.featureDescription}>Get meal suggestions tailored to your dietary preferences.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features

