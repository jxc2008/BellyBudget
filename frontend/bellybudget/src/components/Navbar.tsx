"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct useRouter import for Next.js App Router
import styles from "./Navbar.module.css";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          BellyBudget
        </Link>
        <div className={styles.links}>
          {/* Styled About Button */}
          <button className={styles.navButton} onClick={() => router.push("/about")}>
            About
          </button>
          {/* Styled Login Button */}
          <button className={styles.navButton} onClick={() => router.push("/auth")}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
