"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../../buttons/Button";
import Link from "next/link";
import { COLOURS } from "@/app/constants";
import GoBack from "../../buttons/GoBack";
import CalendarPicker from "../../buttons/CalendarPicker";
import MemberTable from "../components/memberTable";
import { useSession } from "next-auth/react";
import AlertModal from "./modals/AlertModal";

function NewProject() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const router = useRouter();
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleClientNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };

  const handleDeadlineChange = (date) => {
    setDeadline(date.toISOString().split("T")[0]);
  };
  const handleSetClickedSuggestions = (newClickedSuggestions) => {
    setClickedSuggestions(newClickedSuggestions);
  };

  const handleInputChange = (event) => {
    setDeadline(event.target.value);
  };

  async function addProject(formData) {
    try {
      const res = await fetch("/api/Projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: formData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create the project");
      } else {
        await updateLogs(formData);
      }
    } catch (error) {
      console.error("Error creating the project:", error);
    }
  }

  async function updateLogs(formData) {
    try {
      const res = await fetch("/api/LogMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: formData.clientname,
          projectName: formData.projectname,
          addedBy: userEmail,
          messageDescription: `Client name: ${formData.clientname}, Project name: ${formData.projectname}, Budget: ${formData.budget}, Deadline: ${formData.deadline}, Members: ${formData.memberEmails}`,
          messageType: "New Project",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update log messages");
      }
    } catch (error) {
      console.error("Error updating log messages:", error);
    }
  }

  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!clientName || !projectName || !deadline || !budget) {
      setModalTitle("Missing Required Fields");
      setModalMessage("Please fill out all required fields.");
      setShowModal(true);
      return;
    }

    if (clickedSuggestions.length > 0) {
      const memberEmails = clickedSuggestions.map((user) => user.email);

      const currentDate = new Date();
      const selectedDeadline = new Date(deadline);

      if (isNaN(selectedDeadline.getTime())) {
        setModalTitle("Invalid Deadline");
        setModalMessage("Please enter a valid deadline.");
        setShowModal(true);
        return;
      }

      if (selectedDeadline < currentDate) {
        setModalTitle("Invalid Deadline");
        setModalMessage("The deadline cannot be in the past.");
        setShowModal(true);
        return;
      }

      if (isNaN(budget) || parseFloat(budget) <= 0) {
        setModalTitle("Invalid Budget");
        setModalMessage("Please enter a valid budget.");
        setShowModal(true);
        return;
      }

      const formData = {
        clientname: clientName,
        projectname: projectName,
        deadline: selectedDeadline.toISOString(),
        budget: parseFloat(budget),
        memberEmails: memberEmails,
        removedEmails: [],
      };

      await addProject(formData);

      router.refresh();
      router.push("/manager/project");
    } else {
      setModalTitle("Member Selection Required");
      setModalMessage("Please select at least one member.");
      setShowModal(true);
    }
  };

  return (
    <div>
      <form>
        <Link href="/manager/project">
          <GoBack />
        </Link>
        <div
          className="header"
          style={{
            borderBottom: "1px solid black",
            marginTop: "30px",
            fontWeight: "bold",
            fontSize: "28px",
            paddingBottom: "15px",
          }}
        >
          New Project
        </div>
        <div
          className="project-details"
          style={{
            marginTop: "10px",
            width: "75%",
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: "22px",
          }}
        >
          <div
            className="project-detail--input"
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              style={{
                fontWeight: "bold",
                marginRight: "30px",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "170px",
              }}
            >
              Client Name
            </label>
            <input
              value={clientName}
              onChange={handleClientNameChange}
              required={true}
              style={{
                flex: 1,
                fontSize: "20px",
                border: "1px solid black",
                borderRadius: "10px",
                height: "40px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontWeight: "normal",
              }}
            />
          </div>
          <div
            className="project-detail--input"
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              style={{
                fontWeight: "bold",
                marginRight: "30px",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "170px",
              }}
            >
              Project Name
            </label>
            <input
              value={projectName}
              onChange={handleProjectNameChange}
              required={true}
              style={{
                flex: 1,
                fontSize: "20px",
                border: "1px solid black",
                borderRadius: "10px",
                height: "40px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontWeight: "normal",
              }}
            />
          </div>
          <div
            className="project-detail--input-grp"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div
              className="project-detail--input-grp-item"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginRight: "30px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  width: "170px",
                }}
              >
                Deadline
              </label>
              <CalendarPicker onDateChange={handleDeadlineChange} />
              <input
                required={true}
                onChange={handleInputChange}
                value={deadline}
                style={{
                  flex: 1,
                  fontSize: "20px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  height: "40px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  fontWeight: "normal",
                  marginLeft: "10px",
                }}
              />
            </div>
            <div className="project-detail--input-grp-item">
              <label
                style={{
                  fontWeight: "bold",
                  marginRight: "30px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  width: "170px",
                  marginLeft: "80px",
                }}
              >
                Budget
              </label>
              £
              <input
                value={budget}
                onChange={handleBudgetChange}
                required={true}
                style={{
                  flex: 1,
                  fontSize: "20px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  height: "40px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  fontWeight: "normal",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>
        </div>

        <MemberTable
          clickedSuggestions={clickedSuggestions}
          setClickedSuggestions={handleSetClickedSuggestions}
        />

        <div
          style={{
            marginTop: "100px",
            textAlign: "right",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ marginLeft: "10px" }}>
            <Button
              bgcolour={COLOURS.GREEN_ENABLED}
              colour={COLOURS.WHITE}
              label="+ Add Project"
              onClick={handleAddProject}
              type="submit"
            />
          </div>
          <div style={{ marginLeft: "10px" }}>
            <Link href="/manager/project">
              <Button
                bgcolour={COLOURS.GREY}
                colour={COLOURS.BLACK}
                label="Cancel"
              />
            </Link>
          </div>
        </div>
      </form>
      {showModal && (
        <AlertModal
          title={modalTitle}
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default NewProject;
