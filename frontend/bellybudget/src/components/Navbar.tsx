"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter(); // Initialize Next.js router

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          BellyBudget
        </Link>
        <div className={styles.links}>
          <Link href="/about" className={styles.link}>
            About
          </Link>
          {/* Redirects to /auth instead of /login */}
          <button className={styles.link} onClick={() => router.push("/auth")}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
