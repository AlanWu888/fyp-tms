import React from "react";
import { COLOURS } from "@/app/constants";
import Button from "@/app/(components)/buttons/Button";

function DeleteModal({ title, onConfirm, onCancel }) {
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
          <h2>{title}</h2>
        </div>

        <div
          style={{
            paddingTop: "20px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "20px",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
            }}
          >
            Are you sure you want to delete this project?
          </p>
          <p
            style={{
              marginBottom: "10px",
            }}
          >
            This action is irreversible and you will not be able to get this
            project back! You may want to download the project logs before
            deleting.
          </p>
          <p
            style={{
              marginBottom: "10px",
            }}
          >
            Do you want to proceed?
          </p>

          <div
            className="modal-button-group"
            style={{
              display: "flex",
              marginTop: "35px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              bgcolour={COLOURS.RED}
              colour="white"
              label="Yes"
              onClick={onConfirm}
            />
            <div style={{ marginLeft: "10px" }}></div>
            <Button
              bgcolour={COLOURS.GREY}
              colour="#000"
              label="No"
              onClick={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;

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
