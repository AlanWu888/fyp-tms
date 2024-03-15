import React, { useState } from "react";
import Button from "@/app/(components)/buttons/Button";
import { COLOURS } from "@/app/constants";
import { useSession } from "next-auth/react";
import CalendarPicker from "@/app/(components)/buttons/CalendarPicker";

function ManageValuesModal({ onClose, currentProject }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [errorMessage, setErrorMessage] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  async function updateLogs(
    clientName,
    projectName,
    messageDescription,
    messageType,
  ) {
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
          messageDescription: messageDescription,
          messageType: messageType,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update log messages");
      } else {
        console.log("successfully updated log messages");
      }
    } catch (error) {
      console.error("Error updating log messages:", error);
    }
  }

  async function patchDB_deadline() {
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
            deadline: newDeadline,
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
        console.log("successful patch update to timesheet");
        await updateLogs(
          currentProject[0].clientname,
          currentProject[0].projectname,
          `Deadline changed to ${newDeadline} from ${currentProject[0].deadline.split("T")[0]}`,
          "Deadline modified",
        );
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  async function patchDB_budget() {
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
            budget: newBudget,
          },
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
        console.log("successful patch update to timesheet");
        await updateLogs(
          currentProject[0].clientname,
          currentProject[0].projectname,
          `Budget changed to £${newBudget} from ${currentProject[0].budget}`,
          "Budget modified",
        );
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  const handleSubmit = async () => {
    if (newBudget !== "") {
      const messageDescription = `Budget changed to ${newBudget}`;
      const messageType = `Budget modified`;
      console.log(messageDescription);
      console.log(messageType);
      patchDB_budget();
      onClose();
    }
    if (newDeadline !== "") {
      const messageDescription = `Deadline changed to ${newDeadline}`;
      const messageType = `Deadline modified`;
      console.log(messageDescription);
      console.log(messageType);
      patchDB_deadline();
      onClose();
    }
    // onClose();
  };

  const handleChangeBudget = (event) => {
    setNewBudget(event.target.value);
  };

  const handleChangeDeadline = (date) => {
    setNewDeadline(date.toISOString().split("T")[0]);
  };

  const handleInputChange = (event) => {
    setNewDeadline(event.target.value);
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
              <button
                onClick={() => setErrorMessage("")}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ff6666",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
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
          <h2>{`Manage budget and deadline for ${currentProject[0].clientname} - ${currentProject[0].projectname}`}</h2>
        </div>

        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: "10px",
                position: "relative",
                paddingTop: "20px",
              }}
            >
              <div>
                <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Enter a new budget
                </label>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "normal",
                      marginRight: "10px",
                      width: "50px",
                    }}
                  >
                    £
                  </p>
                  <input
                    placeholder="Enter a new budget"
                    type="text"
                    value={newBudget}
                    onChange={handleChangeBudget}
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      height: "40px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      fontWeight: "normal",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                  Choose a new deadline
                </label>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: "50px", marginRight: "10px" }}>
                    <CalendarPicker onDateChange={handleChangeDeadline} />
                  </div>
                  <input
                    onChange={handleInputChange}
                    value={newDeadline}
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      height: "40px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      fontWeight: "normal",
                    }}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div
              className="modal-button-group"
              style={{ display: "flex", marginTop: "35px" }}
            >
              <div style={{ marginRight: "10px" }}>
                <Button
                  bgcolour={COLOURS.GREEN_ENABLED}
                  colour={COLOURS.WHITE}
                  label="Save"
                  type="submit"
                  disabled={!newBudget && !newDeadline}
                  disabledColour={COLOURS.GREEN_DISABLED}
                />
              </div>
              <div>
                <Button
                  bgcolour={COLOURS.GREY}
                  colour="#000"
                  label="Cancel"
                  onClick={onClose}
                />
              </div>
              {JSON.stringify(newDeadline)}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageValuesModal;

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
  height: "300px",
  backgroundColor: "#fff",
  borderRadius: "10px",
};
