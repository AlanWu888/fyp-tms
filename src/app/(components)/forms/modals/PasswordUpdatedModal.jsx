import React from "react";
import { COLOURS } from "@/app/constants";
import Button from "@/app/(components)/buttons/Button";

function PasswordUpdatedModal({ onClose }) {
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
          <h2>Password Updated</h2>
        </div>

        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <p>Your password has been successfully updated.</p>

          <div
            className="modal-button-group"
            style={{
              display: "flex",
              marginTop: "35px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              bgcolour={COLOURS.GREY}
              colour="#000"
              label="Close"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordUpdatedModal;

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
