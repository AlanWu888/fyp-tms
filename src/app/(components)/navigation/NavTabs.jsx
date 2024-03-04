"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/NavTabs.module.css"; // Import CSS module styles

const NavTabs = ({ items, selectedDay, onItemClick }) => {
  return (
    <nav className={styles.navbarContainer}>
      {items.map((item, index) => (
        <a
          key={index}
          href="#"
          className={`${styles.navItem} ${
            item === selectedDay ? styles.selected : ""
          }`}
          onClick={() => onItemClick(item)}
        >
          {item}
        </a>
      ))}
    </nav>
  );
};

export default NavTabs;
