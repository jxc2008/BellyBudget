import type React from "react"
import Navbar from "./Navbar"
import styles from "./Layout.module.css"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}

export default Layout

