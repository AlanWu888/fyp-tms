import React, { useState, useEffect } from "react";
import Button from "../../buttons/Button";
import { COLOURS } from "@/app/constants";
import { useSession } from "next-auth/react";

function EntryModal({ timesheetId, entry, onClose, onTimesheetUpdate }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [clientName, setClientName] = useState(entry.clientName);
  const [projectName, setProjectName] = useState(entry.projectName);
  const [taskDescription, setTaskDescription] = useState(entry.taskDescription);

  const [additionalNotes, setAdditionalNotes] = useState(entry.additionalNotes);

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // get projects and only show the projects user is part of
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Projects");
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

  const convertTimeToDecimal = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(parseFloat);
    return Number(hours + minutes / 60).toPrecision(5);
  };

  const convertDecimalToTime = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const [time, setTime] = useState(convertDecimalToTime(entry.time));

  useEffect(() => {
    setIsDirty(
      clientName !== entry.clientName ||
        projectName !== entry.projectName ||
        taskDescription !== entry.taskDescription ||
        time !== entry.time ||
        additionalNotes !== entry.additionalNotes,
    );
  }, [clientName, projectName, taskDescription, time, additionalNotes, entry]);

  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    setClientName(selectedClient);
    // Reset project name when client changes
    setProjectName("");
  };

  const handleProjectChange = (e) => {
    const selectedProject = e.target.value;
    setProjectName(selectedProject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Timesheets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: timesheetId,
          updatedFields: {
            entryId: entry._id,
            clientName,
            projectName,
            taskDescription,
            time: convertTimeToDecimal(time),
            additionalNotes,
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      }
      onTimesheetUpdate(); // Trigger the callback function to update timesheet data
      onClose();
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  };

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
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
          <h2>Editing time entry for task</h2>
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
                  onChange={(e) => setTaskDescription(e.target.value)}
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
                />
              </label>
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
                  />
                </label>
              </div>
            </div>

            <div
              className="modal-button-group"
              style={{ display: "flex", marginTop: "55px" }}
            >
              <div style={{ marginRight: "10px" }}>
                <Button
                  bgcolour={COLOURS.GREEN_ENABLED}
                  colour="#000"
                  label="Save"
                  type="submit"
                  disabled={!isDirty}
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

export default EntryModal;

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
  height: "500px",
  backgroundColor: "#fff",
  borderRadius: "10px",
};
