import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/Button";
import { COLOURS } from "@/app/constants";
import NavTabs from "../navigation/NavTabs";
import EntryModal from "./modal/day-entry-modal";
import AdditionModal from "./modal/day-additional-modal";
import ConfirmDeleteModal from "./modal/ConfirmDeleteModal";

function DayViewTimesheet({ date, setDate }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const [dayOfWeek, setDayOfWeek] = useState("");
  const [weekDates, setWeekDates] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTimesheetForDelete, setSelectedTimesheetForDelete] =
    useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  function getStartOfWeek(isoDateString) {
    const date = new Date(isoDateString);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return monday.toISOString();
  }

  useEffect(() => {
    function getWeekDates(isoDateString) {
      const days = [];
      const monday = getStartOfWeek(isoDateString);

      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + i);
        days.push(date.toISOString());
      }

      return days;
    }

    setWeekDates(getWeekDates(date));
  }, [date]);

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
    const dayIndex = (dateObj.getDay() + 6) % 7;
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
    const selectedIndex = days.indexOf(selectedDay);
    setDate(weekDates[selectedIndex]);
  };

  const handleClickEdit = (timesheet) => {
    setSelectedEntry(timesheet);
    setSelectedTimesheetId(timesheet._id);
    setEditModalOpen(true);
  };

  const handleClickDelete = (timesheet) => {
    setSelectedTimesheetForDelete(timesheet);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch("/api/Timesheets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTimesheetForDelete._id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
      fetchData();
      filterTimesheets();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
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
          marginTop: "10px",
        }}
      >
        <NavTabs
          items={[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
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
          <p>Track a new task by pressing &quot;Add new Task&quot;</p>
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
                  {timesheet.taskDescription} - ({timesheet.taskType})
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
          onTimesheetUpdate={fetchData}
        />
      )}
      {newModalOpen && (
        <AdditionModal
          date={date}
          onClose={() => setNewModalOpen(false)}
          onTimesheetUpdate={fetchData}
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
      {deleteModalOpen && (
        <ConfirmDeleteModal
          timesheet={selectedTimesheetForDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default DayViewTimesheet;
