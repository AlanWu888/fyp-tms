import React from "react";

function Checkbox({ isChecked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        style={{ display: "none" }}
      />
      <div
        style={{
          width: "24px",
          height: "24px",
          border: "2px solid #282258",
          backgroundColor: isChecked ? "#282258" : "transparent",
          borderRadius: "4px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="32px"
            height="32px"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M9 16.2l-4.2-4.2c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0l3.49 3.49 7.17-7.17c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41L10.41 16.6c-.38.38-1.02.38-1.41 0z" />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
}

export default Checkbox;
