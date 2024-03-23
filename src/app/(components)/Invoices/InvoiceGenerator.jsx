"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import GoBack from "../buttons/GoBack";
import { createUniqueTasksFromTimesheets } from "./utils";

function InvoiceGenerator() {
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const client = queryParams.get("clientname") || "";
    const project = queryParams.get("projectname") || "";
    const selectedTasksParam = queryParams.get("selectedTasks") || "[]";
    setClient(client);
    setProject(project);
    setSelectedTasks(JSON.parse(selectedTasksParam));
  }, []);

  useEffect(() => {
    fetchData();
  }, [client, project]);

  const filterTimesheets = (timesheets, client, project) => {
    return timesheets.filter(
      (timesheet) =>
        timesheet.clientName === client && timesheet.projectName === project,
    );
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const responseData = await response.json();
      const timesheetData = responseData.timesheets;

      const filteredTimesheets = filterTimesheets(
        timesheetData,
        client,
        project,
      );
      const uniqueTasks = createUniqueTasksFromTimesheets(filteredTimesheets);

      setTasks(uniqueTasks);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const filterSelectedTasks = () => {
    if (!tasks.taskDescriptions) {
      return {};
    }

    const selectedTaskNames = selectedTasks.map((task) => task.split(" (")[0]);

    const filteredTasks = Object.entries(tasks.taskDescriptions)
      .filter(([taskName]) => selectedTaskNames.includes(taskName))
      .reduce((obj, [taskName, taskDetails]) => {
        obj[taskName] = taskDetails;
        return obj;
      }, {});

    return filteredTasks;
  };

  const renderTaskTable = () => {
    const filteredTasks = filterSelectedTasks();

    const calculateTotalAmount = () => {
      let total = 0;
      Object.values(filteredTasks).forEach((taskDetails) => {
        taskDetails.taskTypes.forEach((taskType) => {
          taskType.users.forEach((user) => {
            total += parseFloat(calculateAmount(user.rate, user.time));
          });
        });
      });
      return total.toFixed(2);
    };

    const handleRateChange = (event, taskName, userEmail) => {
      const newRate = parseFloat(event.target.value);
      const updatedTasks = { ...tasks };

      updatedTasks.taskDescriptions[taskName].taskTypes.forEach((taskType) => {
        taskType.users.forEach((user) => {
          if (user.email === userEmail) {
            user.rate = newRate;
          }
        });
      });

      setTasks(updatedTasks);
    };

    const handleHoursChange = (event, taskName, userEmail) => {
      const newHours = parseFloat(event.target.value);
      const updatedTasks = { ...tasks };

      updatedTasks.taskDescriptions[taskName].taskTypes.forEach((taskType) => {
        taskType.users.forEach((user) => {
          if (user.email === userEmail) {
            user.time = newHours;
          }
        });
      });

      setTasks(updatedTasks);
    };

    const calculateAmount = (rate, hours) => {
      const amount = rate * hours;
      return isNaN(amount) ? 0 : amount.toFixed(2);
    };

    return (
      <div>
        <div>{JSON.stringify(filteredTasks)}</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{ textAlign: "left", borderBottom: "1px solid black" }}
              >
                Description
              </th>
              <th
                style={{ textAlign: "left", borderBottom: "1px solid black" }}
              >
                Task Type
              </th>
              <th
                style={{ textAlign: "left", borderBottom: "1px solid black" }}
              >
                Rate
              </th>
              <th
                style={{ textAlign: "left", borderBottom: "1px solid black" }}
              >
                Hours
              </th>
              <th
                style={{ textAlign: "left", borderBottom: "1px solid black" }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredTasks).map(
              ([taskName, taskDetails], taskIndex) => (
                <React.Fragment key={taskName}>
                  <tr>
                    <td colSpan="5">
                      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                        {taskName}
                      </p>
                    </td>
                  </tr>
                  {taskDetails.taskTypes.flatMap((taskType) =>
                    taskType.users.map((user, userIndex) => (
                      <tr key={`${taskType.type}-${user.email}`}>
                        <td style={{ paddingLeft: "20px" }}>{user.email}</td>
                        <td>{taskType.type}</td>
                        <td>
                          {taskType.type === "Non-Billable" ? (
                            <>
                              £{" "}
                              <input
                                type="number"
                                style={{
                                  width: "80px",
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                }}
                                value={0}
                                onChange={(event) =>
                                  handleRateChange(event, taskName, user.email)
                                }
                                required={true}
                                disabled={taskType.type === "Non-Billable"}
                              />{" "}
                              /hr
                            </>
                          ) : (
                            <>
                              £{" "}
                              <input
                                type="number"
                                style={{
                                  width: "80px",
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                }}
                                value={user.rate || ""}
                                onChange={(event) =>
                                  handleRateChange(event, taskName, user.email)
                                }
                                required={true}
                                disabled={taskType.type === "Non-Billable"}
                              />{" "}
                              /hr
                            </>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            value={user.time.toFixed(3)}
                            style={{
                              width: "60px",
                              border: "1px solid black",
                              borderRadius: "5px",
                            }}
                            onChange={(event) =>
                              handleHoursChange(event, taskName, user.email)
                            }
                            required={true}
                          />{" "}
                          hr
                        </td>
                        <td style={{ width: "120px" }}>
                          £{" "}
                          {taskType.type === "Non-Billable"
                            ? "0.00"
                            : calculateAmount(user.rate, user.time)}
                        </td>
                      </tr>
                    )),
                  )}
                  {taskIndex < Object.entries(filteredTasks).length - 1 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          borderBottom: "1px solid black",
                          paddingTop: "10px",
                        }}
                      >
                        <hr style={{ margin: "0" }} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ),
            )}
          </tbody>
          <tfoot>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  borderTop: "1px solid black",
                  fontWeight: "bold",
                  paddingTop: "20px",
                }}
              >
                Total:
              </td>
              <td
                colSpan="4"
                style={{
                  textAlign: "right",
                  borderTop: "1px solid black",
                  fontWeight: "bold",
                  paddingRight: "75px",
                  paddingTop: "20px",
                }}
              >
                £ {calculateTotalAmount()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: "120px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <Link
              href={{
                pathname: `/manager/invoice/choose-tasks`,
                query: {
                  clientname: client,
                  projectname: project,
                },
              }}
            >
              <GoBack />
            </Link>
          </div>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
              Generate invoices for Clients
            </p>
            <p>{`You are generating an invoice for ${client} - ${project}`}</p>
          </div>
          <div>{renderTaskTable()}</div>
        </>
      )}
    </div>
  );
}

export default InvoiceGenerator;
