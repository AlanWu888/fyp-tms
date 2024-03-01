// "use client";

// import React, { useState } from "react";

// import DateCounter from "@/app/(components)/timesheet/header/dateCounter/date-counter";
// import ViewSelector from "@/app/(components)/timesheet/header/dayWeek/day-week";

// function TimesheetHeader({ setDate }) {
//   const [mode, setMode] = useState("day");

//   const updateMode = (newMode) => {
//     setMode(newMode);
//   };

//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//   };

//   return (
//     <div className="timesheet-header">
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//       <DateCounter mode={mode} onDateChange={handleDateChange} />
//         <ViewSelector mode={mode} updateMode={updateMode} />
//       </div>
//     </div>
//   );
// }

// export default TimesheetHeader;

"use client";

import React, { useState } from "react";
import "./header.css";

const TimesheetHeader = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("day");

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
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    if (mode === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setDate(newDate);
  };

  const renderDateText = () => {
    if (mode === "week") {
      const startOfWeek = new Date(date);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjusting for Monday to be the start of the week
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get to Sunday

      return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
    } else {
      return date.toDateString();
    }
  };

  return (
    <div className="timesheet-header" style={{ display: "flex", justifyContent: "space-between" }}>
      <div className="date-counter" style={{ display: "flex", alignItems: "center" }}
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
