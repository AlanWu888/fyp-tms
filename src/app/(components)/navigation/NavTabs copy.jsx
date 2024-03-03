"use client";

import React, { useState } from "react";
import styles from "./styles/NavTabs.module.css"; // Import CSS module styles

const NavTabs = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <nav className={styles.navbarContainer}>
      {items.map((item, index) => (
        <a
          key={index}
          href="#"
          className={`${styles.navItem} ${item === selectedItem ? styles.selected : ""}`}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </a>
      ))}
    </nav>
  );
};

export default NavTabs;
