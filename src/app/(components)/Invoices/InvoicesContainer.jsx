"use client";

import React, { useState, useEffect } from "react";
import { COLOURS } from "@/app/constants";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../loading/Loading";
import Link from "next/link";
import Button from "../buttons/Button";

function InvoicesContainer() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);

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
    fetchProjects();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          Generate invoices for Clients
        </p>
        <p>
          Start by selecting a Project and then choose what tasks you want to
          include in the invoice
        </p>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div>No projects found</div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingLeft: "20px",
              paddingRight: "20px",
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
              background: COLOURS.GREY,
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            Project Title
          </div>
          {projects.map((project) => (
            <div
              key={project._id}
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft: "20px",
                paddingRight: "20px",
                fontSize: "20px",
                borderBottom: "1px solid black",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {project.clientname} - {project.projectname}
              </div>
              <div>
                <Link
                  href={{
                    pathname: `/manager/invoice/choose-tasks`,
                    query: {
                      clientname: project.clientname,
                      projectname: project.projectname,
                    },
                  }}
                >
                  <Button label="view" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoicesContainer;
