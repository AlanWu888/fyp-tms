"use client";

import React, { useEffect, useState } from "react";
import { COLOURS } from "@/app/constants";

function BreakDownTable({ header, mode, data, type, date }) {
  const [dateRange, setDateRange] = useState({});
  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  const filterDataByDateRange = () => {
    const { rangeStart, rangeEnd } = dateRange;
    const filteredData = {};
    for (const key in data) {
      filteredData[key] = data[key].filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= rangeStart && entryDate <= rangeEnd;
      });
    }

    setFilteredData(filteredData);
  };

  const getRanges = () => {
    if (mode === "week") {
      const rangeStart = new Date(date);
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "fortnight") {
      const rangeStart = new Date(date);
      const dayOfMonth = date.getDate();
      const diff = dayOfMonth <= 15 ? 1 : 16;
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 13);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "month") {
      const rangeStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const rangeEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "all") {
      const rangeStart = new Date("1900-01-01");
      const rangeEnd = new Date("2100-12-31");

      setDateRange({ rangeStart, rangeEnd });
    } else {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ rangeStart: startOfDay, rangeEnd: endOfDay });
    }
  };

  function totalHours(data) {
    const totalTime = {};

    for (const task in data) {
      totalTime[task] = data[task].reduce((total, entry) => {
        return total + entry.time;
      }, 0);
    }

    return totalTime;
  }

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function getTotalTime(filteredData) {
    let totalTime = 0;
    for (const task in filteredData) {
      filteredData[task].forEach((entry) => {
        totalTime += entry.time;
      });
    }
    return totalTime;
  }

  return (
    <div style={{ marginBottom: "30px" }}>
      {Object.keys(filteredData).length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              backgroundColor: COLOURS.GREY,
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <div className="left">{`${header}`}</div>
            <div
              className="right"
              style={{
                width: "122px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Time contributed
            </div>
          </div>
          {Object.entries(totalHours(filteredData)).map(([task, totalTime]) => (
            <div
              key={task}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "15px",
                paddingBottom: "15px",
                fontSize: "20px",
              }}
            >
              <div className="left">{`${task}`}</div>
              <div
                className="right"
                style={{
                  width: "122px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {`${convertDecimalToTime(totalTime)}`}
              </div>
              {/* <p>{task}: {totalTime.toFixed(2)} hours</p> */}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid",
              borderBottom: "3px solid",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <div className="left">{`Total`}</div>
            <div
              className="right"
              style={{
                width: "122px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {convertDecimalToTime(getTotalTime(filteredData))}
            </div>
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default BreakDownTable;