"use client";

import React, { useEffect, useState } from "react";
import GoBack from "../../buttons/GoBack";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../../buttons/Button";
import { COLOURS } from "@/app/constants";
import SearchBox from "../../searchBox/SearchBox";
import LoadingSpinner from "../../loading/Loading";

const Logs = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [validProject, setValidProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchProjectData() {
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
      const userProjects = data.projects.filter(
        (project) =>
          project.memberEmails.includes(userEmail) &&
          project.clientname === clientName &&
          project.projectname === projectName,
      );

      if (userProjects.length > 0) {
        setProject(userProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function fetchProjectLogs() {
    try {
      const response = await fetch(
        `/api/LogMessages?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          passwrod: process.env.API_TOKEN,
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const logMessages = data.logMsgs.filter(
        (logMsg) =>
          logMsg.clientName === clientName &&
          logMsg.projectName === projectName,
      );

      if (logMessages.length > 0) {
        setLogs(logMessages);
        setFilteredLogs(logMessages);
      }
    } catch (error) {
      console.error("Error fetching logMessage:", error);
    }
  }

  function downloadLogs(logsData, fileName) {
    const logsJsonString = JSON.stringify(logsData, null, 2);

    const blob = new Blob([logsJsonString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "logs.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  const handleDownloadLogs = () => {
    downloadLogs(filteredLogs, "logs.txt");
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const clientNameParam = queryParams.get("clientName") || "";
    const projectNameParam = queryParams.get("projectName") || "";
    setClientName(clientNameParam);
    setProjectName(projectNameParam);
  }, []);

  useEffect(() => {
    fetchProjectData();
  }, [clientName, projectName]);

  useEffect(() => {
    fetchProjectLogs();
  }, [project]);

  useEffect(() => {
    if (project.length === 1) {
      setValidProject(true);
    }

    setLoading(false);
  }, [project, logs]);

  useEffect(() => {
    const filtered = logs.filter((log) => {
      const formattedDate = new Date(log.createdAt)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .toLowerCase();

      const formattedTime = new Date(log.createdAt)
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .toLowerCase();

      return (
        log.addedBy.toLowerCase().includes(searchTerm) ||
        log.messageDescription.toLowerCase().includes(searchTerm) ||
        log.messageType.toLowerCase().includes(searchTerm) ||
        formattedDate.includes(searchTerm) ||
        formattedTime.includes(searchTerm)
      );
    });
    setFilteredLogs(filtered);
  }, [searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {validProject ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              <div style={{ marginRight: "10px" }}>
                <Link
                  href={{
                    pathname: `/manager/project/view-project`,
                    query: {
                      clientName: clientName,
                      projectName: projectName,
                    },
                  }}
                >
                  <GoBack />
                </Link>
              </div>
              <div>
                <Button
                  bgcolour={COLOURS.GREY}
                  colour={"black"}
                  label="Download Logs"
                  onClick={handleDownloadLogs}
                />
              </div>
            </div>
            <div style={{ width: "500px" }}>
              <SearchBox
                placeholder="Search logs..."
                handleChange={handleSearch}
              />
            </div>
          </div>

          <div style={{ borderBottom: "1px solid", paddingBottom: "50px" }}>
            <p
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >{`${clientName} - ${projectName}`}</p>
            <p>Log of changes</p>
          </div>
          <div style={{ marginTop: "20px" }}>
            {filteredLogs.length > 0 ? (
              <div>
                {filteredLogs
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <div
                      key={index}
                      style={{
                        borderBottom: "double",
                        marginTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{log.addedBy}</div>
                        <div>
                          {new Date(log.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          ||{" "}
                          {new Date(log.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                      <div>{log.messageDescription}</div>
                      <div>{log.messageType}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>No logs available</div>
            )}
          </div>
        </div>
      ) : null}
      {!validProject && !loading && <LoadingSpinner />}
    </div>
  );
};

export default Logs;
