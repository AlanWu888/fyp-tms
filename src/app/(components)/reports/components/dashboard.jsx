"use client";

import React, { useEffect, useState } from "react";
import NavTabs from "../../navigation/NavTabs-project";
import DonutChart from "./donutChart";

function ReportsDashboard({
  timesheets,
  selectedTab,
  setSelectedTab,
  date,
  mode,
}) {
  const [dateRange, setDateRange] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [timePerTask, setTimePerTask] = useState({});
  const [totalTime, setTotalTime] = useState("");

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const getRanges = () => {
    const newDate = new Date(date);
    if (mode === "week") {
      const rangeStart = new Date(newDate);
      const dayOfWeek = newDate.getDay();
      const diff = newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 6);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "fortnight") {
      const rangeStart = new Date(newDate);
      const dayOfMonth = newDate.getDate();
      const diff = dayOfMonth <= 15 ? 1 : 16;
      rangeStart.setDate(diff);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeStart.getDate() + 13);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "month") {
      const rangeStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const rangeEnd = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0,
      );

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "year") {
      const year = newDate.getFullYear();
      const rangeStart = new Date(year, 0, 1);
      const rangeEnd = new Date(year, 11, 31);

      setDateRange({ rangeStart, rangeEnd });
    } else if (mode === "all") {
      const rangeStart = new Date("1900-01-01");
      const rangeEnd = new Date("2100-12-31");

      setDateRange({ rangeStart, rangeEnd });
    } else {
      const startOfDay = new Date(newDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(newDate);
      endOfDay.setHours(23, 59, 59, 999);
      setDateRange({ rangeStart: startOfDay, rangeEnd: endOfDay });
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const filterDataByDateRange = () => {
    const filteredTimesheets = [];

    for (const timesheet of timesheets) {
      const entryDate = new Date(timesheet.date);

      const adjustedRangeEnd = new Date(dateRange.rangeEnd);
      adjustedRangeEnd.setHours(23, 59, 59, 999);

      if (
        entryDate >= new Date(dateRange.rangeStart) &&
        entryDate <= adjustedRangeEnd
      ) {
        filteredTimesheets.push(timesheet);
      }
    }
    setFilteredData(filteredTimesheets);
  };

  function calculateTimePerTaskType() {
    const timePerTaskType = { Billable: 0, "Non-Billable": 0, Research: 0 };

    filteredData.forEach((entry) => {
      const taskType = entry.taskType;
      const time = entry.time || 0;

      if (timePerTaskType.hasOwnProperty(taskType)) {
        timePerTaskType[taskType] += time;
      }
    });

    for (const key in timePerTaskType) {
      if (timePerTaskType.hasOwnProperty(key)) {
        timePerTaskType[key] = parseFloat(timePerTaskType[key].toFixed(3));
      }
    }

    return timePerTaskType;
  }

  function calculateTotalTime() {
    let sum = 0;
    for (const key in timePerTask) {
      if (timePerTask.hasOwnProperty(key)) {
        sum += timePerTask[key];
      }
    }

    setTotalTime(sum);
  }

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  useEffect(() => {
    setTimePerTask(calculateTimePerTaskType());
  }, [filteredData]);

  useEffect(() => {
    calculateTotalTime();
  }, [timePerTask]);

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  return (
    <div
      className="reports--dashboard"
      style={{ width: "100%", borderTop: "1px solid black" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "20px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginRight: "150px",
          }}
        >
          <p>Total Hours</p>
          <p
            style={{ fontWeight: "bold", fontSize: "26px", marginTop: "-10px" }}
          >
            {convertDecimalToTime(totalTime)}
          </p>
        </div>
        <div>
          <DonutChart data={timePerTask} />
        </div>
      </div>
      <div
        style={{
          borderBottom: "1px solid black",
          paddingBottom: "3px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <NavTabs
          items={["Projects", "Tasks", "Team"]}
          activeTab={selectedTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}

export default ReportsDashboard;
