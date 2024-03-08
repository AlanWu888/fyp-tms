"use client";

import React, { useEffect, useState } from "react";
import Button from "../buttons/Button";
import { COLOURS } from "@/app/constants";
import SearchBox from "../searchBox/SearchBox";
import Link from "next/link";

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchData() {
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
      setProjects(data.projects);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.projectname
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          new Date(project.deadline)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .includes(searchTerm),
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div
        className="project-list-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <div className="project-list-header-left">
          <h1 style={{ fontWeight: "bold", fontSize: "28px" }}>Projects</h1>
          <h2>View all your current projects here</h2>
        </div>
        <div
          className="project-list-header-right"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="add-project-button">
            <Link href="/manager/project/new-project">
              <Button
                bgcolour={COLOURS.GREEN_ENABLED}
                colour={COLOURS.WHITE}
                label="+ Add Project"
              />
            </Link>
          </div>
          <div className="project-search" style={{ marginLeft: "10px" }}>
            <SearchBox
              placeholder="Search for project"
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div
        className="project-list-table-header"
        style={{
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          backgroundColor: COLOURS.GREY,
          fontSize: "16px",
        }}
      >
        <div
          className="project-list-table-header-left"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Project Title
        </div>
        <div
          className="project-list-table-header-right"
          style={{ display: "flex" }}
        >
          <div
            style={{
              marginRight: "80px",
              width: "150px",
              border: "1px solid black",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Project Deadline
          </div>
          <div
            style={{
              marginRight: "80px",
              width: "130px",
              border: "1px solid black",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Time Contributed
          </div>
          <div
            style={{
              width: "80px",
              border: "1px solid black",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          ></div>
        </div>
      </div>

      <div className="project-list-table-rows">
        <ul>
          {filteredProjects.map((project) => (
            <li
              key={project._id}
              style={{
                fontWeight: "bold",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                className="project-list-table-row"
                style={{
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  fontSize: "20px",
                  borderBottom: "1px solid black",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="project-row-left">
                  <div className="project-name">
                    {project.clientname} - {project.projectname}
                  </div>
                </div>
                <div
                  className="project-row-right"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    className="project-deadline"
                    style={{
                      marginRight: "80px",
                      width: "150px",
                      border: "1px solid black",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {new Date(project.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    className="project-contributions"
                    style={{
                      marginRight: "80px",
                      width: "130px",
                      border: "1px solid black",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    placeholder
                  </div>
                  <div
                    style={{
                      fontWeight: "normal",
                      fontSize: "16px",
                      width: "80px",
                      border: "1px solid black",
                      textAlign: "right",
                    }}
                  >
                    <Button
                      bgcolour={COLOURS.WHITE}
                      colour={COLOURS.BLACK}
                      label="View"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectsList;
