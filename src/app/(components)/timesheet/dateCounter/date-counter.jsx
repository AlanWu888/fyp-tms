"use client";

import React, { useState } from "react";
import "./date-counter.css";

const DateCounter = () => {
  const [date, setDate] = useState(new Date());

  const incrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  return (
    <div
      className="date-counter"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div>
        <button onClick={decrementDate} className="button-dates">
          <img src={"/arrow-l.png"} alt="Previous Day" />
        </button>
        <button onClick={incrementDate} className="button-dates">
          <img src={"/arrow-r.png"} alt="Next Day" />
        </button>
      </div>
      <h2 className="date-text">
        <b>Today: </b>
        {date.toDateString()}
      </h2>
    </div>
  );
};

export default DateCounter;
