"use client";

import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavUser = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks}>
        <Link
          href="/user/time"
          className={pathname.startsWith("/user/time") ? styles.active : ""}
        >
          Time
        </Link>
        <Link
          href="/user/project"
          className={pathname.startsWith("/user/project") ? styles.active : ""}
        >
          Projects
        </Link>
      </div>

      <div className={styles.rightLinks}>
        <Link href="/api/auth/signout">Sign Out</Link>
      </div>
    </nav>
  );
};

export default NavUser;
