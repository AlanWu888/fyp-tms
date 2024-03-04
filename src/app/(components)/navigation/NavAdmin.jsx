"use client";

import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const NavAdmin = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks} />
      <div className={styles.rightLinks}>
        <div className={styles.rightLinks}>
          <Link href="/api/auth/signout">Sign Out</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavAdmin;
