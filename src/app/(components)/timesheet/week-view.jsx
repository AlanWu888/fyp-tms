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

  const filterTimesheets = () => {
    const filteredTimesheets = timesheets.filter(
      (timesheet) => timesheet.userEmail === userEmail,
    );
    setFilteredTimesheets(filteredTimesheets);
  };

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

    originalJson.forEach((entry) => {
      let existingEntryIndex = transformedJson.findIndex(
        (item) =>
          item.clientName === entry.clientName &&
          item.projectName === entry.projectName &&
          item.taskDescription === entry.taskDescription,
      );

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
    if (
      isNaN(decimalTime) ||
      decimalTime === null ||
      decimalTime === undefined
    ) {
      return "-- : --";
    }
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

  const handleInputChange = (date, index, newValue) => {
    const timePattern = /^(?:2[0-3]|[01]?\d):[0-5]?\d$/;
    const isValidTime = timePattern.test(newValue);

    if (newValue === "") {
      setInputError((prevErrors) => {
        return prevErrors.filter(
          (error) => !(error.date === date && error.index === index),
        );
      });
    } else {
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
      const updatedEdittedFields = [...prevEdittedFields];

      if (newValue === "") {
        return updatedEdittedFields.filter(
          (item) => !(item.date === date && item.index === index),
        );
      } else {
        const existingIndex = updatedEdittedFields.findIndex(
          (item) => item.date === date && item.index === index,
        );

        if (existingIndex !== -1) {
          updatedEdittedFields[existingIndex] = editedInput;
        } else {
          updatedEdittedFields.push(editedInput);
        }

        return updatedEdittedFields;
      }
    });

    const updatedTimesheets = [...modifiedTimesheets];

    let foundMatch = false;
    for (let entry of transformedWeek[index].entries) {
      if (date === entry.date.split("T")[0]) {
        entry.time = convertTimeToDecimal(newValue);
        foundMatch = true;
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

  const handleSave = async () => {
    for (let valueChange of edittedFields) {
      for (let entry of modifiedTimesheets[valueChange.index].entries) {
        const formattedValueChangeDate = new Date(valueChange.date)
          .toISOString()
          .split("T")[0];
        const formattedEntryDate = new Date(entry.date)
          .toISOString()
          .split("T")[0];

        if (formattedValueChangeDate === formattedEntryDate) {
          if (entry._id === "new_value") {
            const postParams = {
              userEmail: userEmail,
              clientName: modifiedTimesheets[valueChange.index].clientName,
              projectName: modifiedTimesheets[valueChange.index].projectName,
              taskDescription:
                modifiedTimesheets[valueChange.index].taskDescription,
              time: entry.time,
              date: new Date(entry.date),
              taskType: modifiedTimesheets[valueChange.index].taskType,
            };
            await postDB(postParams);
          } else {
            if (Math.abs(entry.time - 0) < 0.0001) {
              await deleteDB(entry._id);
            } else {
              const patchParams = {
                entryId: entry._id,
                time: entry.time,
              };
              await patchDB(patchParams);
            }
          }
        }
      }
    }

    fetchData();
    filterTimesheets();
  };

  async function deleteDB(entryId) {
    try {
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: entryId,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }
      fetchData();
      filterTimesheets();
    } catch (error) {
      console.error(error);
    }
  }

  async function postDB(postParams) {
    try {
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData: {
              userEmail: postParams.userEmail,
              clientName: postParams.clientName,
              projectName: postParams.projectName,
              taskDescription: postParams.taskDescription,
              time: parseFloat(postParams.time),
              date: postParams.date,
              taskType: postParams.taskType,
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  async function patchDB(patchParams) {
    try {
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: patchParams.entryId,
            updatedFields: {
              entryId: patchParams.entryId,
              time: patchParams.time,
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  return (
    <div>
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
        <React.Fragment key={`${week.clientName}_${week.projectName}_${index}`}>
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
                  key={`${week.clientName}_${week.projectName}_${weekDates[i]}_${index}`}
                  className={`${weekDates[i]}_${index}_input--container`}
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
                    key={`${week.clientName}_${week.projectName}_${weekDates[i]}_${index}`}
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
        </React.Fragment>
      ))}

      <div
        className="timesheet-rows-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ marginTop: "20px", display: "flex" }}>
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
                <li key={`${error.date}_${idx}`}>
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
