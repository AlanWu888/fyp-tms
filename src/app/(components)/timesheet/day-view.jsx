"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/Button";
import { COLOURS } from "@/app/constants";

function DayViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

  useEffect(() => {
    const filterTimesheets = () => {
      const filteredTimesheets = timesheets.filter(
        (timesheet) => timesheet.userEmail === userEmail,
        (timesheet) => timesheet.date === mydate,
      );
      setFilteredTimesheets(filteredTimesheets);
    };

    filterTimesheets();
  }, [timesheets, userEmail]);

  const handleClickButton = () => {
    alert("button pressed");
  };

  const handleTimeChange = () => {
    alert("time change");
  };

  function convertToTime(number) {
    const integerPart = Math.floor(number);
    const decimalPart = number % 1;

    let hours = integerPart < 10 ? "0" + integerPart : integerPart;
    let minutes = Math.round(decimalPart * 60);

    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes}`;
  }

  function convertToDecimal(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const decimalHours = hours + minutes / 60;

    return decimalHours;
  }

  return (
    <div>
      <p>{date}</p>
      <ul>
        {filteredTimesheets.map((timesheet) =>
          timesheet.entries.map((entry, index) => (
            <li
              key={index}
              className="timesheet-entry border border-black p-3 mb-2"
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="entry-details ">
                  <div>
                    <p style={{ fontSize: "24px" }}>
                      {entry.clientName} - {entry.projectName}
                    </p>
                  </div>
                  <div
                    className="task-description"
                    style={{ fontSize: "16px" }}
                  >
                    {entry.taskDescription}
                  </div>
                </div>
                <div
                  className="timesheet-entry"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginRight: "30px",
                    }}
                  >
                    <input
                      type="text"
                      id={entry._id}
                      value={convertToTime(entry.time)}
                      onChange={handleTimeChange}
                      style={{
                        border: "1px solid black",
                        fontSize: "24px",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        width: "100px",
                        textAlign: "center",
                        marginRight: "50px",
                      }}
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
                      label="Edit"
                      onClick={handleClickButton}
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
                      onClick={handleClickButton}
                    />
                  </div>
                </div>
              </div>
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

export default DayViewTimesheet;
