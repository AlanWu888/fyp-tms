import React from "react";
import { COLOURS } from "@/app/constants";

function ConfirmationModal({ userEmail, onConfirm, onCancel }) {
  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content" style={modalContentStyle}>
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
          <h2>Confirm User Removal</h2>
        </div>

        <div
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <p>Are you sure you want to remove {userEmail}?</p>

          <div
            className="modal-button-group"
            style={{
              display: "flex",
              marginTop: "35px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onConfirm}
              style={{
                padding: "5px 10px",
                backgroundColor: COLOURS.GREEN_ENABLED,
                color: COLOURS.WHITE,
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Yes, Remove
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: "5px 10px",
                backgroundColor: COLOURS.GREY,
                border: "1px solid black",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

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
  width: "500px",
  backgroundColor: "#fff",
  borderRadius: "10px",
};
