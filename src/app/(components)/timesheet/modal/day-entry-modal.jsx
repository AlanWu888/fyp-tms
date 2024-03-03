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
  const [time, setTime] = useState(entry.time);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState({});

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
      console.log(
        JSON.stringify({
          id: timesheetId,
          updatedFields: {
            entryId: entry._id,
            clientName,
            projectName,
            taskDescription,
            time,
            additionalNotes,
          },
        }),
      );
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
            time,
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
        <div className="modal-header">
          <h2>Editing time entry for task</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Client Name:
              <br />
              <select
                value={clientName}
                onChange={handleClientChange}
                style={{ width: "100%" }}
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
            <label>
              Project Name:
              <br />
              <select
                value={projectName}
                onChange={handleProjectChange}
                style={{ width: "100%" }}
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
            <label>
              Task Description:
              <br />
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Time:
              <br />
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Additional Notes:
              <br />
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>

          <Button
            bgcolour={COLOURS.GREEN_ENABLED}
            colour="#000"
            label="Save"
            type="submit"
            disabled={!isDirty}
          />
          <Button
            bgcolour={COLOURS.GREY}
            colour="#000"
            label="Close"
            onClick={onClose}
          />
        </form>
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
  width: "610px",
  height: "700px",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
};
