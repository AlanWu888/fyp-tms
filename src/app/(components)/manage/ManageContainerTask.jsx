"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../loading/Loading";
import ReportsHeader from "../reports/components/header";
import UserBreakdownTask from "./components/userBreakdownTask";
import GoBack from "../buttons/GoBack";
import Link from "next/link";

function ManageContainerTask() {
  const [userEmail, setUserEmail] = useState("");
  const [taskName, setTaskName] = useState("");
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
        return (
          timesheet.userEmail === userEmail &&
          timesheet.taskDescription === taskName
        );
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
    const taskName = queryParams.get("taskName") || "";

    setUserEmail(userEmail);
    setTaskName(taskName);
    getRanges();
  }, []);

  useEffect(() => {
    fetchTimesheets();
  }, [userEmail]);

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  useEffect(() => {
    filterDataByDateRange();
  }, [timesheets, dateRange]);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <div>
              <Link
                href={{
                  pathname: `/manager/manage/view-user`,
                  query: {
                    userEmail: userEmail,
                  },
                }}
              >
                <GoBack />
              </Link>
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <p
                  style={{ fontSize: "28px", fontWeight: "bold" }}
                >{`Viewing timesheet entries for "${taskName}"`}</p>
                <p>{`Submitted by the user, ${userEmail}`}</p>
              </div>
            </div>
            <ReportsHeader
              date={date}
              setDate={setDate}
              mode={mode}
              setMode={setMode}
            />
          </div>
        </>
      )}
      <div>
        <UserBreakdownTask filteredData={filteredData} userEmail={userEmail} />
      </div>
    </div>
  );
}

export default ManageContainerTask;
