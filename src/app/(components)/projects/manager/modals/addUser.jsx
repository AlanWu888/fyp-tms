import React, { useState, useEffect } from "react";
import Button from "@/app/(components)/buttons/Button";
import { COLOURS } from "@/app/constants";
import { useSession } from "next-auth/react";

function AddUserModal({ onClose, currentProject }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState({});
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  async function updateLogs(clientName, projectName, inputValue) {
    try {
      const res = await fetch(
        `/api/LogMessages?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName: clientName,
            projectName: projectName,
            addedBy: userEmail,
            messageDescription: `Added member to project: ${inputValue}`,
            messageType: "Added User",
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update log messages");
      }
    } catch (error) {
      console.error("Error updating log messages:", error);
    }
  }

  async function patchDB() {
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
              memberEmails: currentProject[0].memberEmails.concat(inputValue),
              removedEmails: currentProject[0].removedEmails.filter(
                (email) => email !== inputValue,
              ),
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
          inputValue,
        );
        alert(
          `successfully added ${inputValue} to the project\nThe user will appear next time you load this project`,
        );
      }
    } catch (error) {
      console.error("Error updating timesheet:", error);
    }
  }

  function userExists() {
    return !Object.keys(users).some(
      (key) => users[key].email.toLowerCase() === inputValue.toLowerCase(),
    );
  }

  const handleSubmit = async () => {
    const userExists = users.some(
      (user) => user.email.toLowerCase() === inputValue.toLowerCase(),
    );

    if (userExists) {
      await patchDB();
      onClose();
    } else {
      setErrorMessage("Please enter a valid user email.");
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    console.log(users);

    const filteredSuggestions = users.filter(
      (user) =>
        (`${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())) &&
        !currentProject[0].memberEmails.some(
          (memberEmail) =>
            memberEmail.toLowerCase() === user.email.toLowerCase(),
        ),
    );

    setUserSuggestions(filteredSuggestions);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/Users?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const responseData = await response.json();
      const usersData = responseData.users;
      const userDetails = usersData.map((user) => ({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      }));
      setUsers(userDetails);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOptionClick = (email) => {
    setInputValue(email);
    setUserSuggestions([]);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <h2>Add a member to this project</h2>
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
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>
                Enter a name or email:
                <br />
                <input
                  placeholder="Start typing a user's name or email..."
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  style={{
                    zIndex: 3,
                    width: "100%",
                    fontSize: "16px",
                    border: "1px solid black",
                    borderRadius: "10px",
                    height: "45px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    fontWeight: "normal",
                  }}
                />
              </label>
              {inputValue.length > 2 && userSuggestions.length > 0 && (
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
                    width: "100%",
                    marginTop: "0px",
                    paddingTop: "5px",
                    listStyle: "none",
                    paddingBottom: "10px",
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {userSuggestions.map((user) => (
                    <li
                      key={user.email}
                      onClick={() => handleOptionClick(user.email)}
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
                      {`${user.firstname} ${user.lastname} - ${user.email}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="modal-button-group"
              style={{ display: "flex", marginTop: "35px" }}
            >
              <div style={{ marginRight: "10px" }}>
                <Button
                  bgcolour={COLOURS.GREEN_ENABLED}
                  colour={COLOURS.WHITE}
                  label="+ Add Member"
                  type="submit"
                  disabled={userExists()}
                  // disabled={!inputValue.trim()}
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

export default AddUserModal;

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
  height: "230px",
  backgroundColor: "#fff",
  borderRadius: "10px",
};
