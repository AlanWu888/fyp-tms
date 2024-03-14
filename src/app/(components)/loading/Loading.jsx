"use client";

import React, { useState, useEffect } from "react";
import styles from "./Loading.module.css";

const LoadingSpinner = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((dots) => (dots.length >= 3 ? "." : dots + "."));
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.text}>{`Loading ${dots}`}</p>
    </div>
  );
};

export default LoadingSpinner;
