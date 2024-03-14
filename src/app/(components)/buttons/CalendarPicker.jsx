import React, { useState } from "react";
import Calendar from "react-calendar";
import "./CalendarPicker-styles.css";

const CalendarPicker = ({ onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
    setShowCalendar(false);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const isDateDisabled = ({ activeStartDate, date, view }) => {
    return date < new Date();
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month" && date < new Date()) {
      return "disabled-date";
    }
    return null;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        fontSize: "20px",
      }}
    >
      <button
        type="button"
        onClick={handleCalendarToggle}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/calendar_icon.png"
          alt="Calendar"
          style={{
            width: "40px",
            height: "40px",
            cursor: "pointer",
            border: "1px solid black",
            padding: "2px",
            borderRadius: "10px",
          }}
        />
      </button>
      {showCalendar && (
        <div
          style={{
            padding: "10px",
            position: "absolute",
            zIndex: "3",
            marginTop: "10px",
            border: "1px solid black",
            background: "white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            borderRadius: "5px",
          }}
        >
          <div style={{ width: "350px" }}>
            <div
              style={{
                paddingRight: "10px",
                paddingTop: "30px",
                position: "absolute",
                top: "-30px",
                right: "0",
                cursor: "pointer",
              }}
            >
              <button
                onClick={handleCloseCalendar}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
          </div>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={isDateDisabled}
            tileClassName={tileClassName}
            className="bold-navigation"
          />
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
