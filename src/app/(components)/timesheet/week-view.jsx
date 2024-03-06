import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { COLOURS } from "@/app/constants";

function WeekViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [weekFilteredTimesheets, setWeekFilteredTimesheets] = useState([]);
  const [transformedWeek, setTransformedWeek] = useState([]);

  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // const daysOfTheWeek = [
  //   "Mon",
  //   "Tue",
  //   "Wed",
  //   "Thu",
  //   "Fri",
  //   "Sat",
  //   "Sun",
  // ];

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
          taskType: entry.taskType,
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

    transformedJson.sort((a, b) => {
      if (a.clientName === b.clientName) {
        if (a.projectName === b.projectName) {
          return a.taskDescription.localeCompare(b.taskDescription);
        }
        return a.projectName.localeCompare(b.projectName);
      }
      return a.clientName.localeCompare(b.clientName);
    });

    return transformedJson;
  }

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function getValue(date, entries) {
    const matchingEntry = entries.find(
      (entry) => date === entry.date.split("T")[0],
    );
    return matchingEntry
      ? convertDecimalToTime(JSON.stringify(matchingEntry.time))
      : "";
  }

  function getProjectTotalTime(entries) {
    let total = 0;
    entries.forEach((entry) => {
      total += entry.time;
    });

    return total;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    return `${day.toString().padStart(2, "0")} ${monthName}`;
  }

  return (
    <div>
      {/* Header */}
      <div
        className="timesheet-rows-header"
        style={{
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          backgroundColor: COLOURS.GREY,
        }}
      >
        <div
          className="timesheet-rows-header-left"
          style={{
            fontSize: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Project
        </div>
        <div
          className="timesheet-rows-header-right"
          style={{ display: "flex" }}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={weekDates[i]}
              style={{
                marginRight: "10px",
                width: "95px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              <p>{daysOfTheWeek[i]}</p>
              <p>{formatDate(weekDates[i])}</p>
            </div>
          ))}
          <div
            style={{
              width: "70px",
              marginLeft: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Total
          </div>
        </div>
      </div>

      {transformedWeek.map((week, index) => (
        <>
          {index > 0 &&
          transformedWeek[index - 1].clientName !== week.clientName ? (
            <div
              style={{
                backgroundColor: COLOURS.GREY,
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingLeft: "20px",
                borderBottom: "1px solid black",
                fontSize: "16px",
              }}
            >
              {week.clientName}
            </div>
          ) : null}

          {index > 0 &&
          transformedWeek[index - 1].clientName === week.clientName &&
          transformedWeek[index - 1].projectName !== week.projectName ? (
            <div
              style={{
                backgroundColor: COLOURS.GREY,
                height: "10px",
                borderBottom: "1px solid black",
              }}
            />
          ) : null}

          <div
            className="timesheet-row"
            style={{
              borderBottom: "1px solid black",
              paddingTop: "15px",
              paddingBottom: "15px",
              paddingLeft: "20px",
              paddingRight: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className="timesheet-rows-left">
              <p style={{ fontSize: "20px" }}>
                {week.clientName} - {week.projectName}
              </p>
              <p style={{ fontSize: "14px" }}>
                {week.taskDescription} - ({week.taskType})
              </p>
            </div>
            <div className="timesheet-rows-right" style={{ display: "flex" }}>
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className={weekDates[i]}
                  style={{
                    marginRight: "10px",
                    width: "95px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                  }}
                >
                  <input
                    className={`${weekDates[i]}_${index}`}
                    style={{
                      width: "100%",
                      height: "40px",
                      textAlign: "center",
                      border: "1px solid black",
                      borderRadius: "5px",
                    }}
                    type="text"
                    value={getValue(weekDates[i], week.entries)}
                  />
                </div>
              ))}

              <div
                style={{
                  width: "70px",
                  marginLeft: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "22px",
                  fontWeight: "bold",
                }}
              >
                {convertDecimalToTime(getProjectTotalTime(week.entries))}
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default WeekViewTimesheet;
