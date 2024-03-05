import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function WeekViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [weekFilteredTimesheets, setWeekFilteredTimesheets] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();
      setTimesheets(data.timesheets);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  const filterTimesheets = () => {
    const filteredTimesheets = timesheets.filter(
      (timesheet) => timesheet.userEmail === userEmail,
    );
    setFilteredTimesheets(filteredTimesheets);
  };

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
      const monday = getStartOfWeek(isoDateString);

      // Loop from Monday to Sunday and push ISO strings to the array
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split("T")[0]);
      }

      return days;
    }

    setWeekDates(getWeekDates(date));
  }, [date]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTimesheets();
  }, [timesheets, userEmail]);

  useEffect(() => {
    // Further filter timesheets based on weekDates range
    const weekFilteredTimesheets = filteredTimesheets.filter((timesheet) =>
      weekDates.includes(timesheet.date.split("T")[0]),
    );
    setWeekFilteredTimesheets(weekFilteredTimesheets);
  }, [filteredTimesheets, weekDates]);

  return (
    <div>
      {/* Render week dates */}
      {weekDates.map((date, index) => (
        <div key={index}>{date}</div>
      ))}
      <br />
      {weekFilteredTimesheets.map((timesheet, index) => (
        <div
          key={index}
          style={{ marginBottom: "10px", border: "1px solid red" }}
        >
          <p>User Email: {timesheet.userEmail}</p>
          <p>Client Name: {timesheet.clientName}</p>
          <p>Project Name: {timesheet.projectName}</p>
          <p>Task Description: {timesheet.taskDescription}</p>
          <p>Time: {timesheet.time}</p>
          <p>Date: {timesheet.date}</p>
          <p>Created At: {timesheet.createdAt}</p>
          <p>Updated At: {timesheet.updatedAt}</p>
        </div>
      ))}
      <br />
      {filteredTimesheets.map((timesheet, index) => (
        <div
          key={index}
          style={{ marginBottom: "10px", border: "1px solid black" }}
        >
          <p>User Email: {timesheet.userEmail}</p>
          <p>Client Name: {timesheet.clientName}</p>
          <p>Project Name: {timesheet.projectName}</p>
          <p>Task Description: {timesheet.taskDescription}</p>
          <p>Time: {timesheet.time}</p>
          <p>Date: {timesheet.date}</p>
          <p>Created At: {timesheet.createdAt}</p>
          <p>Updated At: {timesheet.updatedAt}</p>
        </div>
      ))}
    </div>
  );
}

export default WeekViewTimesheet;
