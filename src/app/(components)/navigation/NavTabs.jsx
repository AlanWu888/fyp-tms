"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/NavTabs.module.css"; // Import CSS module styles

const NavTabs = ({ items, selectedDay }) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  // Update selectedItem based on selectedDay prop
  useEffect(() => {
    setSelectedItem(selectedDay);
  }, [selectedDay]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <nav className={styles.navbarContainer}>
      {items.map((item, index) => (
        <a
          key={index}
          href="#"
          className={`${styles.navItem} ${
            item === selectedItem ? styles.selected : ""
          }`}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </a>
      ))}
    </nav>
  );
};

export default NavTabs;
