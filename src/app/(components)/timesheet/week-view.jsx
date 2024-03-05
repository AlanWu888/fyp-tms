import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function WeekViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [weekFilteredTimesheets, setWeekFilteredTimesheets] = useState([]);
  const [transformedWeek, setTransformedWeek] = useState([]);

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

    const transformedWeekFilteredTimesheets = transformJson(
      weekFilteredTimesheets,
    );
    setTransformedWeek(transformedWeekFilteredTimesheets);
  }, [filteredTimesheets, weekDates]);

  useEffect(() => {
    console.log("new week");
    console.log(weekFilteredTimesheets);
    console.log(transformedWeek); // Log the updated transformedWeek state
  }, [weekFilteredTimesheets, transformedWeek]);

  function transformJson(originalJson) {
    let transformedJson = [];

    // Iterate over each entry in the original JSON
    originalJson.forEach((entry) => {
      // Check if there's an existing entry in the transformed JSON for the current combination of client, project, and task
      let existingEntryIndex = transformedJson.findIndex(
        (item) =>
          item.clientName === entry.clientName &&
          item.projectName === entry.projectName &&
          item.taskDescription === entry.taskDescription,
      );

      // If no entry exists, create a new one
      if (existingEntryIndex === -1) {
        transformedJson.push({
          clientName: entry.clientName,
          projectName: entry.projectName,
          taskDescription: entry.taskDescription,
          taskType: "Billable", // Assuming all tasks are billable
          entries: [
            {
              _id: entry._id,
              date: entry.date,
              time: entry.time,
            },
          ],
        });
      } else {
        // If an entry exists, add the current entry to its 'entries' array
        transformedJson[existingEntryIndex].entries.push({
          _id: entry._id,
          date: entry.date,
          time: entry.time,
        });
      }
    });

    return transformedJson;
  }

  return (
    <div>
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

      <br style={{ margin: "20px" }} />

      {transformedWeek.map((task, index) => (
        <div
          key={index}
          style={{ marginBottom: "10px", border: "1px solid green" }}
        >
          <p>Client Name: {task.clientName}</p>
          <p>Project Name: {task.projectName}</p>
          <p>Task Description: {task.taskDescription}</p>
          <div style={{ marginLeft: "20px" }}>
            {task.entries.map((entry, entryIndex) => (
              <div
                key={entryIndex}
                style={{ border: "1px dotted blue", marginBottom: "5px" }}
              >
                <p>Entry ID: {entry._id}</p>
                <p>Date: {entry.date}</p>
                <p>Time: {entry.time}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeekViewTimesheet;
