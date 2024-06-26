import React, { useState, useEffect } from "react";
import Button from "@/app/(components)/buttons/Button";
import { COLOURS } from "@/app/constants";
import { useSession } from "next-auth/react";
import MySelect from "../../selects/select";

function AdditionModal({ date, onClose, onTimesheetUpdate }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const convertTimeToDecimal = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(parseFloat);
    return parseFloat(Number(hours + minutes / 60).toPrecision(5));
  };

  const [timesheets, setTimesheets] = useState([]);
  const [time, setTime] = useState(convertDecimalToTime(0.0));
  const [clientName, setClientName] = useState();
  const [projectName, setProjectName] = useState();
  const [taskDescription, setTaskDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState({});
  const [taskType, setTaskType] = useState(null);
  const [existingTasks, setExistingTasks] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const taskOptions = [
    { value: "r", label: "Research" },
    { value: "b", label: "Billable" },
    { value: "n", label: "Non-Billable" },
  ];

  const handleTaskSelect = (taskType) => {
    setTaskType(taskType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Projects?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const filteredProjects = projects.filter((project) => {
        return project.memberEmails.includes(userEmail);
      });
      setFilteredProjects(filteredProjects);
    }
  }, [projects, userEmail]);

  useEffect(() => {
    const updatedClientProjects = {};
    filteredProjects.forEach((project) => {
      const { clientname, projectname } = project;
      if (!updatedClientProjects[clientname]) {
        updatedClientProjects[clientname] = [projectname];
      } else {
        updatedClientProjects[clientname].push(projectname);
      }
    });

    setClientProjects(updatedClientProjects);
  }, [filteredProjects]);

  useEffect(() => {
    fetchTimesheetData();
  }, [clientName, projectName]);

  useEffect(() => {
    setExistingTasks(uniqueTaskDescriptions());
  }, [timesheets]);

  const handleOptionClick = (taskDescription) => {
    setTaskDescription(taskDescription);
    setUserSuggestions([]);
  };

  async function fetchTimesheetData() {
    try {
      const response = await fetch(
        `/api/Timesheets?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();

      const projectTimesheets = data.timesheets.filter((timesheet) => {
        return (
          timesheet.clientName === clientName &&
          timesheet.projectName === projectName
        );
      });
      setTimesheets(projectTimesheets);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  }

  function uniqueTaskDescriptions() {
    let uniqueDescriptions = [];
    for (let timesheet of timesheets) {
      if (!uniqueDescriptions.includes(timesheet.taskDescription)) {
        uniqueDescriptions.push(timesheet.taskDescription);
      }
    }
    return uniqueDescriptions.sort();
  }

  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    setClientName(selectedClient);
    setProjectName("");
  };

  const handleProjectChange = (e) => {
    const selectedProject = e.target.value;
    setProjectName(selectedProject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName || !projectName || !time || !taskDescription || !taskType) {
      setErrorMessage("Please fill in required fields.");
      return;
    }

    if (time === "00:00") {
      setErrorMessage("Please enter a valid time.");
      return;
    }

    const newDate = new Date(new Date(date).setHours(9, 0, 0, 0)).toISOString();
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
              userEmail,
              clientName,
              projectName,
              taskDescription,
              additionalNotes,
              time: convertTimeToDecimal(time),
              date: newDate,
              taskType: taskType.label,
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
        onTimesheetUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
      setErrorMessage(
        "Failed to update timesheet. Please try again later or check for duplicated entries.",
      );
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setTaskDescription(value);

    const filteredSuggestions = existingTasks.filter((task) =>
      task.toLowerCase().includes(value.toLowerCase()),
    );

    setUserSuggestions(filteredSuggestions);
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {errorMessage && (
          <div
            className="error-message"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "9999",
              backgroundColor: "#ffcccc",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "30px",
              borderRadius: "5px",
              border: "1px solid #ff6666",
              width: "600px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                paddingBottom: "10px",
                borderBottom: "1px solid black",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "24px",
                  textAlign: "left",
                }}
              >
                <p>Error occured :(</p>
              </div>
              <Button
                bgcolour={COLOURS.GREY}
                colour="#000"
                label="Close"
                onClick={() => setErrorMessage("")}
              />
            </div>
            <div>{errorMessage}</div>
          </div>
        )}

        <div
          className="modal-header"
          style={{
            backgroundColor: COLOURS.GREY,
            margin: "auto",
            padding: "10px",
            justifyContent: "center",
            display: "flex",
            fontWeight: "bold",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottom: "1px solid black",
          }}
        >
          <h2>Add a new time entry</h2>
        </div>

        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                Client Name:
                <br />
                <select
                  value={clientName}
                  onChange={handleClientChange}
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    fontSize: "16px",
                    height: "45px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontWeight: "normal",
                  }}
                  required={true}
                >
                  <option value="">Select Client</option>
                  {Object.keys(clientProjects).map((client) => (
                    <option key={client} value={client}>
                      {client}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                Project Name:
                <br />
                <select
                  value={projectName}
                  onChange={handleProjectChange}
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    fontSize: "16px",
                    height: "45px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontWeight: "normal",
                  }}
                  disabled={!clientName}
                  required={true}
                >
                  <option value="">Select Project</option>
                  {clientProjects[clientName]?.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                Task Description:
                <br />
                <input
                  type="text"
                  value={taskDescription}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    fontSize: "16px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    fontSize: "16px",
                    height: "45px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontWeight: "normal",
                    paddingTop: "auto",
                    paddingBottom: "auto",
                  }}
                  required={true}
                />
              </label>
              {taskDescription &&
                taskDescription.length > 1 &&
                userSuggestions.length > 0 && (
                  <ul
                    className="suggestion-list"
                    style={{
                      position: "absolute",
                      borderBottom: "1px solid",
                      borderLeft: "1px solid",
                      borderRight: "1px solid",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                      width: "660px",
                      marginTop: "0px",
                      paddingTop: "5px",
                      listStyle: "none",
                      paddingBottom: "10px",
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    {userSuggestions.map((task) => (
                      <li
                        key={task}
                        onClick={() => handleOptionClick(task)}
                        style={{
                          padding: "5px 10px",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = COLOURS.GREY)
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = COLOURS.WHITE)
                        }
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ width: "75%", marginRight: "20px" }}>
                <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Additional Notes:
                  <p style={{ display: "contents", fontWeight: "normal" }}>
                    {" "}
                    (optional)
                  </p>
                  <br />
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      height: "70px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      paddingTop: "10px",
                      fontWeight: "normal",
                    }}
                  />
                </label>
              </div>
              <div style={{ width: "25%" }}>
                <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Time:
                  <br />
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      height: "70px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      fontWeight: "normal",
                      fontSize: "40px",
                      textAlign: "center",
                    }}
                    required={true}
                  />
                </label>
              </div>
            </div>

            <div
              className="task-type"
              style={{
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                Task Type
              </label>
              <div style={{ marginLeft: "100px" }}>
                <MySelect
                  options={taskOptions}
                  value={taskType}
                  onChange={handleTaskSelect}
                  isRequired={true}
                />
              </div>
            </div>

            <div
              className="modal-button-group"
              style={{ display: "flex", marginTop: "55px" }}
            >
              <div style={{ marginRight: "10px" }}>
                <Button
                  bgcolour={COLOURS.GREEN_ENABLED}
                  colour={COLOURS.WHITE}
                  label="Save"
                  type="submit"
                />
              </div>
              <div>
                <Button
                  bgcolour={COLOURS.GREY}
                  colour="#000"
                  label="Close"
                  onClick={onClose}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdditionModal;

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "fixed",
  zIndex: "1",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",

  backgroundColor: "rgba(0,0,0,0.4)",
};

const modalContentStyle = {
  width: "700px",
  height: "550px",
  backgroundColor: "#fff",
  borderRadius: "10px",
};
