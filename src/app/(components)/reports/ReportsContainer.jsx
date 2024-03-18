"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
// import LoadingSpinner from "../../loading/Loading";
import ReportsHeader from "./components/header";

function ReportsContainer() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [timesheets, setTimesheets] = useState();
  const [filteredTimesheets, setFilteredTimesheets] = useState();
  const [selectedTab, setSelectedTab] = useState("");
  const [mode, setMode] = useState();
  const [date, setDate] = useState(new Date().toDateString());

  async function fetchTimesheets() {
    try {
      const response = await fetch("/api/Timesheets");
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }
      const data = await response.json();
      setTimesheets(data.timesheets);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  }

  async function fetchProjects() {
    try {
      const response = await fetch("/api/Projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const userProjects = data.projects.filter((project) =>
        project.memberEmails.includes(userEmail),
      );

      setProjects(userProjects);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
  }, []);

  return (
    <div>
      <div>
        <ReportsHeader
          date={date}
          setDate={setDate}
          mode={mode}
          setMode={setMode}
        />
      </div>
      <div style={{ border: "1px solid", display: "flex" }}>
        <p>{date}</p>
        <p>{mode}</p>
      </div>
    </div>
  );
}

export default ReportsContainer;
