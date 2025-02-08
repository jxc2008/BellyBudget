"use client"; // Required for event handlers in Next.js App Router

import { useRouter } from "next/navigation";
import styles from "./Hero.module.css";

const Hero = () => {
  const router = useRouter();

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Eat Smart, Spend Less</h1>
        <p className={styles.subtitle}>Plan your meals based on your budget with ease.</p>
        <button className={styles.cta} onClick={() => router.push("/dashboard")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
