import React from "react";
import { COLOURS } from "@/app/constants";
import Button from "@/app/(components)/buttons/Button";

function ConfirmDeleteUserModal({ user, onConfirm, onCancel }) {
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
          <h2>Confirm Delete User</h2>
        </div>

        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <p>Are you sure you want to delete this user?</p>
          <p>
            {user.firstname} {user.lastname}
          </p>
          <p>{user.email}</p>

          <div
            className="modal-button-group"
            style={{
              display: "flex",
              marginTop: "35px",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ marginRight: "10px" }}>
              <Button
                bgcolour={COLOURS.GREEN_ENABLED}
                colour={COLOURS.WHITE}
                label="Delete"
                onClick={onConfirm}
              />
            </div>
            <Button
              bgcolour={COLOURS.GREY}
              colour={COLOURS.BLACK}
              label="Cancel"
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteUserModal;

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
