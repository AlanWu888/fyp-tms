"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading/Loading";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import Button from "../../buttons/Button";
import SaveChangesModal from "./modals/SaveChangesModal";
import userRoleInfo from "./userRoleInfo.json";

const EditUser = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      const user = usersData
        .filter((user) => user._id === userID)
        .map((user) => ({
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          capacity: user.capacity,
        }))[0];

      setUser(user);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userID = queryParams.get("user") || "";
    setUserID(userID);
  }, []);

  useEffect(() => {
    fetchData();
  }, [userID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/Users?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userID,
            newData: {
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              capacity: user.capacity,
              role: user.role,
            },
          }),
        },
      );

      if (response.ok) {
        setShowModal(true);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="edit-user" style={{ margin: "0 auto", width: "800px" }}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {errorMessage && (
            <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
          )}
          {user ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <label style={labelStyle}>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <label style={labelStyle}>First Name:</label>
                <input
                  type="text"
                  name="firstname"
                  value={user.firstname}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <label style={labelStyle}>Last Name:</label>
                <input
                  type="text"
                  name="lastname"
                  value={user.lastname}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <label style={labelStyle}>Capacity:</label>
                <input
                  type="text"
                  name="capacity"
                  value={user.capacity}
                  onChange={handleChange}
                  required
                  style={smallInputStyle}
                  pattern="^\d*\.?\d*$"
                  title="Please enter a valid number or decimal"
                />
                <p style={{ marginLeft: "10px" }}>hours per week</p>
              </div>
              <div
                style={{
                  display: "flex",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <label style={labelStyle}>Role:</label>
                <div style={{ display: "flex" }}>
                  <button
                    type="button"
                    style={{
                      ...buttonStyle,
                      marginRight: "10px",
                      backgroundColor:
                        user.role === "admin"
                          ? COLOURS.LIGHT_BLUE
                          : COLOURS.WHITE,
                    }}
                    onClick={() =>
                      setUser((prevUser) => ({ ...prevUser, role: "admin" }))
                    }
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    style={{
                      ...buttonStyle,
                      marginRight: "10px",
                      backgroundColor:
                        user.role === "manager"
                          ? COLOURS.LIGHT_BLUE
                          : COLOURS.WHITE,
                    }}
                    onClick={() =>
                      setUser((prevUser) => ({ ...prevUser, role: "manager" }))
                    }
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    style={{
                      ...buttonStyle,
                      backgroundColor:
                        user.role === "user"
                          ? COLOURS.LIGHT_BLUE
                          : COLOURS.WHITE,
                    }}
                    onClick={() =>
                      setUser((prevUser) => ({ ...prevUser, role: "user" }))
                    }
                  >
                    User
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: "60px" }}>
                {user.role === "admin" && (
                  <div style={userInformationStyle}>
                    <ul>
                      {userRoleInfo.admin.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {user.role === "manager" && (
                  <div style={userInformationStyle}>
                    <ul>
                      {userRoleInfo.manager.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {user.role === "user" && (
                  <div style={userInformationStyle}>
                    <ul>
                      {userRoleInfo.user.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ marginRight: "10px" }}>
                  <Button
                    bgcolour={COLOURS.GREEN_ENABLED}
                    colour={COLOURS.WHITE}
                    label="Save Changes"
                    type="submit"
                  />
                </div>
                <div>
                  <Link
                    href={{
                      pathname: `/admin`,
                    }}
                  >
                    <Button
                      bgcolour={COLOURS.WHITE}
                      colour={COLOURS.BLACK}
                      label="Cancel"
                    />
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <p>No user found</p>
          )}
        </div>
      )}
      {showModal && (
        <SaveChangesModal onClose={() => setShowModal(false)} user={user} />
      )}
    </div>
  );
};

export default EditUser;

const labelStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  width: "150px",
};

const inputStyle = {
  width: "650px",
  fontSize: "16px",
  border: "1px solid black",
  borderRadius: "10px",
  height: "45px",
  paddingLeft: "10px",
  paddingRight: "10px",
  fontWeight: "normal",
};

const smallInputStyle = {
  ...inputStyle,
  width: "100px",
  textAlign: "center",
};

const buttonStyle = {
  border: "1px solid black",
  borderRadius: "10px",
  cursor: "pointer",
  textDecoration: "none",
  height: "45px",
  paddingLeft: "10px",
  paddingRight: "10px",
  width: "210px",
};

const userInformationStyle = {
  width: "650px",
  marginLeft: "auto",
  border: "1px solid black",
  padding: "10px",
  borderRadius: "10px",
};
