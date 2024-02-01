"use client";

import styles from "./styles/Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const NavAdmin = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftLinks} />
      <div className={styles.rightLinks}>
        <Link href="/admin">Admin</Link>
      </div>
    </nav>
  );
};

export default NavAdmin;
