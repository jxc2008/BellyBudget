import Link from "next/link"
import styles from "./Navbar.module.css"

const Navbar = () => {
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
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

