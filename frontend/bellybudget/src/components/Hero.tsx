"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import styles from "./Hero.module.css"; // ✅ Ensure correct import

const Hero = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard"); // ✅ Redirect to dashboard if logged in
    } else {
      router.push("/auth"); // ✅ Redirect to login page if not logged in
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Eat Smart, Spend Less</h1>
        <p className={styles.subtitle}>Plan your meals based on your budget with ease.</p>
        {/* ✅ Ensures button styling is applied */}
        <button className={styles.ctaButton} onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
