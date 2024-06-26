"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function TimesheetComponent() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch timesheets");
        }
        const data = await response.json();
        setTimesheets(data.timesheets);
      } catch (error) {
        console.error("Error fetching timesheets:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterTimesheets = () => {
      const filteredTimesheets = timesheets.filter(
        (timesheet) => timesheet.userEmail === userEmail,
      );
      setFilteredTimesheets(filteredTimesheets);
    };

    filterTimesheets();
  }, [timesheets, userEmail]);

  return (
    <div>
      <ul>
        {filteredTimesheets.map((timesheet) => (
          <li key={timesheet._id}>
            <div className="border border-black p-3 m-3">
              <div>User Email: {timesheet.userEmail}</div>
              <div>Date: {timesheet.date}</div>
              <h3>Entries:</h3>
              <ul>
                {timesheet.entries.map((entry, index) => (
                  <li key={index}>
                    <div>Client Name: {entry.clientName}</div>
                    <div>Project Name: {entry.projectName}</div>
                    <div>Task Description: {entry.taskDescription}</div>
                    <div>Time: {entry.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimesheetComponent;
