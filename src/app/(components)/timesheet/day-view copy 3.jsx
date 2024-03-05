import React, { useState, useEffect } from "react";
import NavTabs from "../navigation/NavTabs";

function DayViewTimesheet({ date, setDate }) {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [weekDates, setWeekDates] = useState([]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getStartOfWeek(isoDateString) {
    const date = new Date(isoDateString);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date.setDate(diff));
    return monday.toISOString();
  }

  useEffect(() => {
    function getWeekDates(isoDateString) {
      const days = [];
      const monday = getStartOfWeek(isoDateString); // Assuming getStartOfWeek is defined

      // Loop from Monday to Sunday and push ISO strings to the array
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + i);
        days.push(date.toISOString());
      }

      return days;
    }

    setWeekDates(getWeekDates(date));
  }, [date]);

  useEffect(() => {
    const isoDate = date.split("T")[0];
    const dateObj = new Date(isoDate);
    const dayIndex = (dateObj.getDay() + 6) % 7;
    const day = days[dayIndex];
    setDayOfWeek(day);
  }, [date]);

  const handleNavTabClick = (selectedDay) => {
    const selectedIndex = days.indexOf(selectedDay);
    setDate(weekDates[selectedIndex]);
  };

  return (
    <div>
      <div
        className="timesheet-rows-header"
        style={{
          borderBottom: "1px solid black",
          paddingBottom: "3px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <NavTabs
          items={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ]}
          selectedDay={dayOfWeek}
          onItemClick={handleNavTabClick}
        />
      </div>
      <div>{date}</div>
      <br />
      <div>
        {weekDates.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
    </div>
  );
}

export default DayViewTimesheet;
