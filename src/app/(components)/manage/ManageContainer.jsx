"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../loading/Loading";
import ReportsHeader from "../reports/components/header";
import UserBreakdown from "./components/userBreakdown";

function ManageContainer() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [timesheets, setTimesheets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [mode, setMode] = useState();
  const [date, setDate] = useState(new Date().toDateString());
  const [dateRange, setDateRange] = useState({});

  async function fetchTimesheets() {
    try {
      setLoading(true);
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();

      const userTimesheets = data.timesheets.filter((timesheet) => {
        return timesheet.userEmail === userEmail;
      });
      setTimesheets(userTimesheets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setError(error.message);
      setLoading(false);
    }
  }

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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userEmail = queryParams.get("userEmail") || "";
    setUserEmail(userEmail);
  }, []);

  useEffect(() => {
    fetchTimesheets();
  }, [userEmail]);

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <ReportsHeader
              date={date}
              setDate={setDate}
              mode={mode}
              setMode={setMode}
            />
          </div>
        </>
      )}
      <div>{userEmail}</div>
      <div>{JSON.stringify(filteredData)}</div>
      <div>
        <UserBreakdown filteredData={filteredData} />
      </div>
    </div>
  );
}

export default ManageContainer;
