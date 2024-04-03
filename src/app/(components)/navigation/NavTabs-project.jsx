import React from "react";
import styles from "./styles/NavTabs.module.css";

const NavTabs = ({ items, activeTab, onTabChange }) => {
  const handleItemClick = (item) => {
    onTabChange(item);
  };

  return (
    <nav className={styles.navbarContainer}>
      {items.map((item, index) => (
        <a
          key={index}
          href="#"
          className={`${styles.navItem} ${item === activeTab ? styles.selected : ""}`}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </a>
      ))}
    </nav>
  );
};

export default NavTabs;
