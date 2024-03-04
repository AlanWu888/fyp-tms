"use client";

import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const NavManager = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks}>
        <Link
          href="/manager/time"
          className={pathname === "/manager/time" ? styles.active : ""}
        >
          Time
        </Link>
        <Link
          href="/manager/project"
          className={pathname === "/manager/project" ? styles.active : ""}
        >
          Projects
        </Link>
        <Link
          href="/manager/report"
          className={pathname === "/manager/report" ? styles.active : ""}
        >
          Reports
        </Link>
        <Link
          href="/manager/invoice"
          className={pathname === "/manager/invoice" ? styles.active : ""}
        >
          Invoice
        </Link>
        <Link
          href="/manager/manage"
          className={pathname === "/manager/manage" ? styles.active : ""}
        >
          Manage
        </Link>
      </div>

      <div className={styles.rightLinks}>
        <Link href="/api/auth/signout">Sign Out</Link>
      </div>
    </nav>
  );
};

export default NavManager;
