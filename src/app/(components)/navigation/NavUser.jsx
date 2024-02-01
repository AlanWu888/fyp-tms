"use client";

import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const NavUser = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks}>
        <Link
          href="/user/time"
          className={pathname === "/user/time" ? styles.active : ""}
        >
          Time
        </Link>
        <Link
          href="/user/project"
          className={pathname === "/user/project" ? styles.active : ""}
        >
          Projects
        </Link>
        <Link
          href="/user/report"
          className={pathname === "/user/report" ? styles.active : ""}
        >
          Reports
        </Link>
      </div>

      <div className={styles.rightLinks}>
        <Link
          href="/user"
          className={pathname === "/user" ? styles.active : ""}
        >
          User
        </Link>
      </div>
    </nav>
  );
};

export default NavUser;
