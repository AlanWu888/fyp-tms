import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { COLOURS } from "@/app/constants";
import Button from "../buttons/Button";

function WeekViewTimesheet({ date }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [timesheets, setTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [weekFilteredTimesheets, setWeekFilteredTimesheets] = useState([]);
  const [transformedWeek, setTransformedWeek] = useState([]);
  const [modifiedTimesheets, setModifiedTimesheets] = useState([]);
  const [inputError, setInputError] = useState([]);
  const [edittedFields, setEdittedFields] = useState([]);

  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
    setModifiedTimesheets(transformedWeekFilteredTimesheets);
  }, [filteredTimesheets, weekDates]);

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

  const convertTimeToDecimal = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(parseFloat);
    return Number(hours + minutes / 60).toPrecision(5);
  };

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

  const handleInputChange = (date, index, newValue, column) => {
    console.log("Handle input change:", date, index, newValue);

    // const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]?$/;
    const timePattern = /^(?:2[0-3]|[01]?\d):[0-5]?\d$/;
    const isValidTime = timePattern.test(newValue);

    if (newValue === "") {
      setInputError((prevErrors) => {
        // Remove the error for this input
        return prevErrors.filter(
          (error) => !(error.date === date && error.index === index),
        );
      });
    } else {
      // Update input error based on time pattern validation
      // update edittedFields state with `${date}_${column}`
      setInputError((prevErrors) => {
        const newErrors = [...prevErrors];
        const errorIndex = newErrors.findIndex(
          (error) => error.date === date && error.index === index,
        );
        if (!isValidTime && errorIndex === -1) {
          newErrors.push({ date, index });
        } else if (isValidTime && errorIndex !== -1) {
          newErrors.splice(errorIndex, 1);
        }
        return newErrors;
      });
    }

    const editedInput = {
      date: date,
      index: index,
      newValue: newValue,
    };

    setEdittedFields((prevEdittedFields) => {
      // Clone the previous state
      const updatedEdittedFields = [...prevEdittedFields];

      // Check if the input value is empty
      if (newValue === "") {
        // Remove any existing entry with the same date and index
        return updatedEdittedFields.filter(
          (item) => !(item.date === date && item.index === index),
        );
      } else {
        // Check if the edited input already exists in the state
        const existingIndex = updatedEdittedFields.findIndex(
          (item) => item.date === date && item.index === index,
        );

        // If it exists, update the value
        if (existingIndex !== -1) {
          updatedEdittedFields[existingIndex] = editedInput;
        } else {
          // If it doesn't exist, add it to the state
          updatedEdittedFields.push(editedInput);
        }

        return updatedEdittedFields;
      }
    });

    const updatedTimesheets = [...modifiedTimesheets];

    console.log(JSON.stringify(transformedWeek[index].entries));

    let foundMatch = false;
    for (let entry of transformedWeek[index].entries) {
      if (date === entry.date.split("T")[0]) {
        entry.time = convertTimeToDecimal(newValue);
        foundMatch = true;
        break; // no need to continue looping once a match is found
      }
    }

    if (!foundMatch) {
      const time = convertTimeToDecimal(newValue);
      updatedTimesheets[index].entries.push({
        _id: "new_value",
        date: date,
        time: time,
      });
    }
  };

  const handleClickButton = () => {
    console.log(JSON.stringify(modifiedTimesheets));
    alert(JSON.stringify(modifiedTimesheets));
  };

  const handleSave = () => {
    console.log("edit: ");
    console.log(edittedFields);
    console.log(modifiedTimesheets[6].entries);

    for (let valueChange of edittedFields) {
      for (let entry of modifiedTimesheets[valueChange.index].entries) {
        // Convert both dates to the same format before comparing
        const formattedValueChangeDate = new Date(valueChange.date)
          .toISOString()
          .split("T")[0];
        const formattedEntryDate = new Date(entry.date)
          .toISOString()
          .split("T")[0];

        if (formattedValueChangeDate === formattedEntryDate) {
          if (entry._id === "new_value") {
            // PATCH method
            console.log(
              `PATCH method, ${formattedValueChangeDate}, ${formattedEntryDate} :: ${entry._id}`,
            );
          } else {
            // POST method
            console.log(
              `POST method, ${formattedValueChangeDate}, ${formattedEntryDate} :: ${entry._id}`,
            );
          }
        }
      }
    }
  };

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

      {transformedWeek.length === 0 && (
        <div style={{ padding: "20px", textAlign: "center" }}>
          No timesheets found
        </div>
      )}

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
                    defaultValue={getValue(weekDates[i], week.entries)}
                    onChange={(e) =>
                      handleInputChange(weekDates[i], index, e.target.value, i)
                    }
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

      <div
        className="timesheet-rows-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ marginTop: "20px", display: "flex" }}>
          <div style={{ marginRight: "10px" }}>
            <Button
              bgcolour={COLOURS.GREY}
              colour={COLOURS.BLACK}
              label="+ Track another Task"
              onClick={handleClickButton}
            />
          </div>
          <div>
            <Button
              bgcolour={COLOURS.GREEN_ENABLED}
              colour={COLOURS.WHITE}
              label="Save"
              onClick={handleSave}
              disabled={inputError.length > 0 || edittedFields.length === 0}
              disabledColour={COLOURS.GREEN_DISABLED}
            />
          </div>
        </div>

        {inputError.length > 0 && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <p>Please fix the following input errors at:</p>
            <ul>
              {inputError.map((error, idx) => (
                <li key={idx}>
                  [ {error.date} ]:{" "}
                  {transformedWeek[error.index] &&
                    transformedWeek[error.index].clientName}
                  ,{" "}
                  {transformedWeek[error.index] &&
                    transformedWeek[error.index].projectName}{" "}
                  -{" "}
                  {transformedWeek[error.index] &&
                    transformedWeek[error.index].taskDescription}{" "}
                  (
                  {transformedWeek[error.index] &&
                    transformedWeek[error.index].taskType}
                  )
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeekViewTimesheet;
