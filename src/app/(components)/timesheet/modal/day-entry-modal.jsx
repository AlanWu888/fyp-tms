"use client";

import React, { useState, useEffect } from "react";
import Button from "../../buttons/Button";
import { COLOURS } from "@/app/constants";

function EntryModal({ timesheetId, entry, onClose, onTimesheetUpdate }) {
  const [clientName, setClientName] = useState(entry.clientName);
  const [projectName, setProjectName] = useState(entry.projectName);
  const [taskDescription, setTaskDescription] = useState(entry.taskDescription);
  const [time, setTime] = useState(entry.time);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isDirty, setIsDirty] = useState(false); // State to track changes

  // Check for changes in form fields
  useEffect(() => {
    setIsDirty(
      clientName !== entry.clientName ||
        projectName !== entry.projectName ||
        taskDescription !== entry.taskDescription ||
        time !== entry.time ||
        additionalNotes !== "",
    );
  }, [clientName, projectName, taskDescription, time, additionalNotes, entry]);

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
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Project Name:
              <br />
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                style={{ width: "100%" }}
              />
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

          <div>{JSON.stringify(timesheetId)}</div>
          <div>{JSON.stringify(entry)}</div>

          <Button
            bgcolour={COLOURS.GREEN_ENABLED}
            colour="#000"
            label="Save"
            type="submit"
            disabled={!isDirty} // Disable the Save button if there are no changes
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
