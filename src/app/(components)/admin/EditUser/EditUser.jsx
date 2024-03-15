"use client";

import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading/Loading";

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
};

const EditUser = () => {
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Users");
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
      // Add code to send updated user data to server
      console.log("Updated user data:", user);
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
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <label style={labelStyle}>Role:</label>
                <input
                  type="text"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <label style={labelStyle}>Capacity:</label>
                <input
                  type="text"
                  name="capacity"
                  value={user.capacity}
                  onChange={handleChange}
                  required
                  style={smallInputStyle}
                />
                <span style={{ marginLeft: "10px" }}>hours per week</span>
              </div>
              <button type="submit">Save Changes</button>
            </form>
          ) : (
            <p>No user found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditUser;
