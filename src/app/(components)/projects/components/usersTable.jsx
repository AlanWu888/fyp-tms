"use client";

import React, { useEffect, useState } from "react";
import { COLOURS } from "@/app/constants";
import Button from "../../buttons/Button";
import { useSession } from "next-auth/react";
import UserRemovedModal from "./modals/UserRemovedModal";
import ConfirmationModal from "./modals/ConfirmationModal";

function UsersTable({ header, mode, data, date, currentProject }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [dateRange, setDateRange] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUserRemovedModal, setShowUserRemovedModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState("");

  useEffect(() => {
    getRanges();
  }, [date, mode]);

  useEffect(() => {
    filterDataByDateRange();
  }, [dateRange]);

  const filterDataByDateRange = () => {
    const { rangeStart, rangeEnd } = dateRange;
    const filteredData = {};
    for (const key in data) {
      filteredData[key] = data[key].filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= rangeStart && entryDate <= rangeEnd;
      });
    }

    setFilteredData(filteredData);
  };

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

  function totalHours(data) {
    const totalTime = {};

    for (const user in data) {
      totalTime[user] = data[user].reduce((total, entry) => {
        return total + entry.time;
      }, 0);
    }

    return totalTime;
  }

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  function getTotalTime(filteredData) {
    let totalTime = 0;
    for (const user in filteredData) {
      filteredData[user].forEach((entry) => {
        totalTime += entry.time;
      });
    }
    return totalTime;
  }

  async function updateLogs(clientName, projectName, emailToRemove) {
    try {
      const res = await fetch("/api/LogMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: clientName,
          projectName: projectName,
          addedBy: userEmail,
          messageDescription: `Removed member from project: ${emailToRemove}`,
          messageType: "Removed User",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update log messages");
      }
    } catch (error) {
      console.error("Error updating log messages:", error);
    }
  }

  async function patchDB(emailToRemove) {
    try {
      const response = await fetch("/api/Projects", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientname: currentProject[0].clientname,
          projectname: currentProject[0].projectname,
          newData: {
            memberEmails: currentProject[0].memberEmails.filter(
              (email) => email !== emailToRemove,
            ),
            removedEmails:
              currentProject[0].removedEmails.concat(emailToRemove),
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
        await updateLogs(
          currentProject[0].clientname,
          currentProject[0].projectname,
          emailToRemove,
        );
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  const handleRemoveUser = (userEmail) => {
    setUserToRemove(userEmail);
    setShowConfirmationModal(true);
  };

  const handleConfirmRemove = async () => {
    setShowConfirmationModal(false);
    await patchDB(userToRemove);
    setShowUserRemovedModal(true);
  };

  const handleCancelRemove = () => {
    setShowConfirmationModal(false);
    setUserToRemove("");
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      {Object.keys(filteredData).length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              backgroundColor: COLOURS.GREY,
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <div className="left">{`${header}`}</div>
            <div
              className="right"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "125px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                Time contributed
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  width: "125px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
          {Object.entries(totalHours(filteredData)).map(([user, totalTime]) => (
            <div
              key={user}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "15px",
                paddingBottom: "15px",
                fontSize: "20px",
                height: "80px",
              }}
            >
              <div className="left">{`${user}`}</div>
              <div
                className="right"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "125px",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  {`${convertDecimalToTime(totalTime)}`}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginLeft: "20px",
                    width: "125px",
                    justifyContent: "center",
                  }}
                >
                  {currentProject[0].removedEmails.includes(user) ? (
                    // Render something if user is in removedEmails
                    <p
                      style={{
                        fontSize: "16px",
                        color: "red",
                        justifyContent: "center",
                        display: "flex",
                        textAlign: "center",
                      }}
                    >
                      User was removed
                    </p>
                  ) : (
                    // Render the "Remove" button if user is not in removedEmails
                    <Button
                      label={"Remove"}
                      onClick={() => handleRemoveUser(user)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid",
              borderBottom: "3px solid",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            <div className="left">{`Total`}</div>
            <div
              className="right"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "125px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {convertDecimalToTime(getTotalTime(filteredData))}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  width: "125px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          userEmail={userToRemove}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
        />
      )}

      {showUserRemovedModal && (
        <UserRemovedModal
          userEmail={userToRemove}
          onClose={() => setShowUserRemovedModal(false)}
        />
      )}
    </div>
  );
}

export default UsersTable;
