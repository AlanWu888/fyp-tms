import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/Button";
import { COLOURS } from "@/app/constants";
import NavTabs from "../navigation/NavTabs";
import EntryModal from "./modal/day-entry-modal";
import AdditionModal from "./modal/day-additional-modal";

function DayViewTimesheet({ date, setDate }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dailyTotal, setDailyTotal] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState(null); // State to hold the selected timesheet ID
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
      (timesheet) =>
        timesheet.userEmail === userEmail &&
        new Date(timesheet.date).toISOString().split("T")[0] ===
          date.split("T")[0],
    );
    setFilteredTimesheets(filteredTimesheets);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterTimesheets();
  }, [timesheets, userEmail, date]);

  useEffect(() => {
    const isoDate = date.split("T")[0];
    const dateObj = new Date(isoDate);
    const dayIndex = dateObj.getDay();
    const day = days[dayIndex];
    setDayOfWeek(day);
  }, [date]);

  useEffect(() => {
    let daily = 0;

    filteredTimesheets.forEach((timesheet) => {
      daily += parseFloat(timesheet.time);
    });

    setDailyTotal(daily);
  }, [filteredTimesheets]);

  const handleNavTabClick = (selectedDay) => {
    const today = new Date(date);
    const currentDay = today.getDay();
    const diff = currentDay - days.indexOf(selectedDay);
    const newDate = new Date(
      today.setDate(today.getDate() - diff),
    ).toISOString();
    setDate(newDate);
  };

  const handleClickEdit = (timesheet) => {
    setSelectedEntry(timesheet);
    setSelectedTimesheetId(timesheet._id); // Set the selected timesheet ID
    setEditModalOpen(true);
  };

  const handleClickDelete = async (timesheet) => {
    const isConfirmed =
      window.confirm(`Are you sure you want to delete this entry?

    Client Name: ${timesheet.clientName}
    Project Name: ${timesheet.projectName}
    Task Description: ${timesheet.taskDescription}`);
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch("/api/Timesheets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: timesheet._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
      fetchData();
      filterTimesheets();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickNewTask = (date) => {
    setNewModalOpen(true);
  };

  function convertToTime(number) {
    const integerPart = Math.floor(number);
    const decimalPart = number % 1;

    let hours = integerPart < 10 ? "0" + integerPart : integerPart;
    let minutes = Math.round(decimalPart * 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes}`;
  }

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
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ]}
          selectedDay={dayOfWeek}
          onItemClick={handleNavTabClick}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            textAlign: "right",
          }}
        >
          <div style={{ marginRight: "20px" }}>
            <p>Day Total:</p>
            <p>{convertToTime(dailyTotal.toFixed(2))}</p>
          </div>
        </div>
      </div>
      {filteredTimesheets.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            paddingBottom: "20px",
            borderBottom: "1px solid black",
          }}
        >
          <p>No tasks currently kept...</p>
          <p>Track a new task by pressing "Add new Task"</p>
        </div>
      )}
      <ul>
        {filteredTimesheets.map((timesheet, index) => (
          <li
            key={index}
            className="timesheet-entry p-3 mb-2"
            style={{ borderBottom: "1px solid black" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="entry-details">
                <div>
                  <p style={{ fontSize: "24px" }}>
                    {timesheet.clientName} - {timesheet.projectName}
                  </p>
                </div>
                <div className="task-description" style={{ fontSize: "16px" }}>
                  {timesheet.taskDescription}
                </div>
              </div>
              <div
                className="timesheet-entry"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div
                  style={{
                    marginRight: "120px",
                    marginTop: "auto",
                    marginBottom: "auto",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {convertToTime(timesheet.time)}
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  <Button
                    bgcolour={COLOURS.GREY}
                    colour={"black"}
                    label="Edit"
                    onClick={() => handleClickEdit(timesheet)}
                  />
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  <Button
                    bgcolour={COLOURS.GREY}
                    colour={"black"}
                    label="Delete"
                    onClick={() => handleClickDelete(timesheet)}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {editModalOpen && (
        <EntryModal
          timesheetId={selectedTimesheetId}
          entry={selectedEntry}
          onClose={() => setEditModalOpen(false)}
          onTimesheetUpdate={fetchData} // Pass the callback function to update timesheet data
        />
      )}
      {newModalOpen && (
        <AdditionModal
          date={date}
          onClose={() => setNewModalOpen(false)}
          onTimesheetUpdate={fetchData} // Pass the callback function to update timesheet data
        />
      )}
      <div style={{ marginTop: "20px" }}>
        <Button
          bgcolour={COLOURS.GREY}
          colour="#000"
          label="+ Track another Task"
          onClick={handleClickNewTask}
        />
      </div>
    </div>
  );
}

export default DayViewTimesheet;
