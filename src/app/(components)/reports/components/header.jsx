"use client";

import React, { useEffect } from "react";
import MySelect from "../../selects/select";
import "./header.css";

function ReportsHeader({ date, setDate, mode, setMode }) {
  const selectOptions = [
    { value: "day", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
    { value: "all", label: "All Time" },
  ];

  const handleSelectChange = (mode) => {
    setMode(mode.value);
  };

  const getModeString = () => {
    switch (mode) {
      case "day":
        return "Today: ";
      case "week":
        return "This Week: ";
      case "month":
        return "This Month: ";
      case "year":
        return "This Year: ";
      case "all":
        return "All Time";
      default:
        return "";
    }
  };

  const incrementDate = () => {
    const newDate = new Date(date);
    switch (mode) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      default:
        break;
    }
    setDate(newDate.toDateString());
  };

  const decrementDate = () => {
    const newDate = new Date(date);
    switch (mode) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      default:
        break;
    }
    setDate(newDate.toDateString());
  };

  const renderDateText = () => {
    const currentDate = new Date(date);

    if (mode === "week") {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek.getDay();
      const diff =
        currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toDateString()} - ${endOfWeek.toDateString()}`;
    } else if (mode === "month") {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      return `${startOfMonth.toDateString()} - ${endOfMonth.toDateString()}`;
    } else if (mode === "year") {
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
      return `${startOfYear.toDateString()} - ${endOfYear.toDateString()}`;
    } else {
      return currentDate.toDateString();
    }
  };

  const getLabelFromValue = (value) => {
    return (
      selectOptions.find((option) => option.value === value) || {
        value: "",
        label: "",
      }
    );
  };

  useEffect(() => {
    setMode(selectOptions[0].value);
  }, []);

  return (
    <div
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
      <div
        className="date-counter"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div>
          {mode !== "all" ? (
            <div style={{ width: "95px" }}>
              <button onClick={decrementDate} className="button-dates">
                <img src={"/arrow-l.png"} alt="Previous Day" />
              </button>
              <button onClick={incrementDate} className="button-dates">
                <img src={"/arrow-r.png"} alt="Next Day" />
              </button>
            </div>
          ) : (
            <div style={{ width: "95px" }}></div>
          )}
        </div>
        <h2 className="date-text">
          <b>{getModeString()}</b>
          {mode !== "all" ? <>{renderDateText()}</> : null}
        </h2>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p style={{ marginRight: "10px" }}>view by:</p>
        <div style={{ zIndex: "2" }}>
          <MySelect
            options={selectOptions}
            value={getLabelFromValue(mode)}
            onChange={handleSelectChange}
            isRequired={false}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportsHeader;
