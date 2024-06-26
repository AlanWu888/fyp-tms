import React, { useState } from "react";
import PropTypes from "prop-types";
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

  const handleChangeBudget = (event) => {
    setNewBudget(event.target.value);
  };

  const handleChangeDeadline = (date) => {
    setNewDeadline(date.toISOString().split("T")[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newBudget !== "") {
      if (isNaN(newBudget) || parseFloat(newBudget) <= 0) {
        setErrorMessage("Please enter a valid budget amount.");
        return;
      }
      patchDBBudget();
    }
    if (newDeadline !== "") {
      patchDBDeadline();
    }
    onClose();
  };

  const patchDBBudget = async () => {
    try {
      const response = await fetch(
        `/api/Projects?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
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
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
        await updateLogs(
          currentProject[0].clientname,
          currentProject[0].projectname,
          `Budget changed to £${newBudget} from £${currentProject[0].budget}`,
          "Budget modified",
        );
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  };

  const patchDBDeadline = async () => {
    try {
      const response = await fetch(
        `/api/Projects?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
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
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update timesheet");
      } else {
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
  };

  const updateLogs = async (
    clientName,
    projectName,
    messageDescription,
    messageType,
  ) => {
    try {
      const res = await fetch(
        `/api/LogMessages?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName,
            projectName,
            addedBy: userEmail,
            messageDescription,
            messageType,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update log messages");
      } else {
      }
    } catch (error) {
      console.error("Error updating log messages:", error);
    }
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
                <p>Error occurred :(</p>
              </div>
              <Button
                bgcolour={COLOURS.GREY}
                colour="#000"
                label="Close"
                onClick={onClose}
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
                    disabled
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ManageValuesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentProject: PropTypes.array.isRequired,
};

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
