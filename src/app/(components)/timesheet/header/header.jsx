"use client";

import React, { useState, useEffect } from "react";
import "./header.css";

const TimesheetHeader = ({ date: dateString, setNewDate, mode, setMode }) => {
  const [date, setDate] = useState(new Date(dateString));

  useEffect(() => {
    setDate(new Date(dateString));
  }, [dateString]);

  const setDay = () => {
    setMode("day");
  };

  const setWeek = () => {
    setMode("week");
  };

  const incrementDate = () => {
    const newDate = new Date(date);
    if (mode === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setDate(newDate);
    setNewDate(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    if (mode === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDate(newDate);
    setNewDate(newDate);
  };

  const renderDateText = () => {
    if (mode === "week") {
      const startOfWeek = new Date(date);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
    } else {
      return date.toDateString();
    }
  };

  return (
    <div
      className="timesheet-header"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
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
          <b>{mode === "day" ? "Today" : "This Week"}: </b>
          {renderDateText()}
        </h2>
      </div>

      <div className="day-or-week">
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={setDay}
            className={
              mode === "day"
                ? "button-view button-left active"
                : "button-view button-left"
            }
          >
            Day
          </button>
          <button
            onClick={setWeek}
            className={
              mode === "week"
                ? "button-view button-right active"
                : "button-view button-right"
            }
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetHeader;
