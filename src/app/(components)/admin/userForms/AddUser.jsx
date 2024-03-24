"use client";

import React, { useState } from "react";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import Button from "../../buttons/Button";
import { v4 as uuidv4 } from "uuid";

const AddUser = () => {
  const generatePassword = () => {
    return uuidv4().substr(0, 18);
  };

  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    capacity: "",
    role: "",
    password: generatePassword(),
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/Users", {
        method: "POST",
        body: JSON.stringify({ formData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create the user");
      } else {
        console.log("successfully created a user");
        downloadUserDetails(formData);

        setFormData({
          email: "",
          firstname: "",
          lastname: "",
          capacity: "",
          role: "",
          password: generatePassword(),
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create the user. Please try again.");
    }
  };

  const downloadUserDetails = (userData) => {
    const { email, firstname, lastname, capacity, role } = userData;
    const filename = `${email}.txt`;
    const userDetails = `User:     ${firstname} ${lastname}\nRole:     ${role}\nemail:    ${email}\nPassword: ${formData.password}\n\nPlease change your password before you log in!`;

    const blob = new Blob([userDetails], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="add-user" style={{ margin: "0 auto", width: "800px" }}>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.firstname}
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
              value={formData.lastname}
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
              value={formData.capacity}
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
                    formData.role === "admin"
                      ? COLOURS.LIGHT_BLUE
                      : COLOURS.WHITE,
                }}
                onClick={() =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    role: "admin",
                  }))
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
                    formData.role === "manager"
                      ? COLOURS.LIGHT_BLUE
                      : COLOURS.WHITE,
                }}
                onClick={() =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    role: "manager",
                  }))
                }
              >
                Manager
              </button>
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor:
                    formData.role === "user"
                      ? COLOURS.LIGHT_BLUE
                      : COLOURS.WHITE,
                }}
                onClick={() =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    role: "user",
                  }))
                }
              >
                User
              </button>
            </div>
          </div>
          <div style={{ marginBottom: "20px" }}>
            {formData.role === "admin" && (
              <div style={userInformationStyle}>
                Admin-specific content goes here
              </div>
            )}

            {formData.role === "manager" && (
              <div style={userInformationStyle}>
                Manager-specific content goes here
              </div>
            )}

            {formData.role === "user" && (
              <div style={userInformationStyle}>
                User-specific content goes here
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              marginBottom: "60px",
              alignItems: "center",
            }}
          >
            <label style={labelStyle}>Password:</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled
              style={{
                ...inputStyle,
                backgroundColor: "#f2f2f2",
                opacity: 0.6,
                width: "540px",
              }}
            />
            <button
              type="button"
              style={{
                ...buttonStyle,
                backgroundColor: COLOURS.LIGHT_BLUE,
                marginLeft: "10px",
                width: "100px",
              }}
              onClick={() =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  password: generatePassword(), // Regenerate password
                }))
              }
            >
              Regenerate
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ marginRight: "10px" }}>
              <Button
                bgcolour={COLOURS.GREEN_ENABLED}
                colour={COLOURS.WHITE}
                label="Add user"
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
      </div>
    </div>
  );
};

export default AddUser;

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
