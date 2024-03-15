import React, { useState, useEffect } from "react";
import { COLOURS } from "@/app/constants";

function MemberTable({ clickedSuggestions, setClickedSuggestions }) {
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Users");
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectSuggestion = (suggestion) => {
    setClickedSuggestions((prevClickedSuggestions) => [
      ...prevClickedSuggestions,
      suggestion,
    ]);
    setInputValue(suggestion.firstname + " " + suggestion.lastname);
    setFilteredSuggestions([]);
  };

  const handleRemoveUser = (index) => {
    const removedUser = clickedSuggestions[index];
    setClickedSuggestions((prevClickedSuggestions) =>
      prevClickedSuggestions.filter((_, i) => i !== index),
    );
    setUsers((prevUsers) => [...prevUsers, removedUser]);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length < 3) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = users
      .filter(
        (user) =>
          !clickedSuggestions.some(
            (clickedUser) =>
              clickedUser.firstname.toLowerCase() ===
                user.firstname.toLowerCase() &&
              clickedUser.lastname.toLowerCase() ===
                user.lastname.toLowerCase() &&
              clickedUser.email.toLowerCase() === user.email.toLowerCase() &&
              clickedUser.role.toLowerCase() === user.role.toLowerCase(),
          ) &&
          (user.firstname.toLowerCase().includes(value.toLowerCase()) ||
            user.lastname.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.role.toLowerCase().includes(value.toLowerCase())),
      )
      .reduce((unique, user) => {
        if (!unique.some((u) => u.email === user.email)) {
          unique.push(user);
        }
        return unique;
      }, [])
      .slice(0, 3);
    setFilteredSuggestions(filtered);
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  return (
    <div>
      <div
        className="member-table-header-top"
        style={{
          borderTop: "1px solid black",
          paddingTop: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          marginTop: "10px",
          backgroundColor: COLOURS.GREY,
          fontWeight: "bold",
          fontSize: "22px",
        }}
      >
        Members
      </div>
      <div
        className="member-table-header-bottom"
        style={{
          borderBottom: "1px solid black",
          paddingTop: "5px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: COLOURS.GREY,
          fontWeight: "normal",
          fontSize: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            className="member-table-spacer-m"
            style={{ width: "175px", marginRight: "10px" }}
          >
            First Name
          </div>
          <div
            className="member-table-spacer-m"
            style={{ width: "175px", marginRight: "10px" }}
          >
            Last Name
          </div>
          <div
            className="member-table-spacer-s"
            style={{ width: "150px", marginRight: "10px" }}
          >
            Role
          </div>
          <div
            className="member-table-spacer-l"
            style={{ width: "400px", marginRight: "10px" }}
          >
            E-mail
          </div>
        </div>
        <div style={{ display: "flex" }}></div>
      </div>

      {clickedSuggestions.length === 0 ? (
        <div
          style={{
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid",
          }}
        >
          No users added to this project
        </div>
      ) : (
        <div>
          <ul>
            {clickedSuggestions.map((suggestion, index) => (
              <li key={index}>
                <div
                  style={{
                    borderBottom: "1px solid",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    paddingBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      className="member-table-spacer-m"
                      style={{ width: "175px", marginRight: "10px" }}
                    >
                      {suggestion.firstname}
                    </div>
                    <div
                      className="member-table-spacer-m"
                      style={{ width: "175px", marginRight: "10px" }}
                    >
                      {suggestion.lastname}
                    </div>
                    <div
                      className="member-table-spacer-s"
                      style={{ width: "150px", marginRight: "10px" }}
                    >
                      {suggestion.role}
                    </div>
                    <div
                      className="member-table-spacer-l"
                      style={{ width: "400px", marginRight: "10px" }}
                    >
                      {suggestion.email}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <button onClick={() => handleRemoveUser(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Start typing a user's name or email..."
            style={{
              width: "450px",
              border: "1px solid black",
              fontSize: "16px",
              padding: "5px",
              borderRadius: "10px",
            }}
          />
          {filteredSuggestions.length > 0 && (
            <ul
              style={{
                border: "1px solid black",
                width: "450px",
                marginTop: "-20px",
                paddingTop: "20px",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
              }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: "450px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      index === hoveredIndex
                        ? "rgba(0, 0, 0, 0.1)"
                        : "transparent",
                    transition: "background-color 0.3s",
                  }}
                >
                  <div>
                    {suggestion.firstname} {suggestion.lastname}
                  </div>
                  <div>{suggestion.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberTable;
