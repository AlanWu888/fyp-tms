"use client";

import { useEffect, useState } from "react";

function ProjectsComponent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <div className="border border-black p-3 m-3">
            <li key={project._id}>
              <p>Client Name: {project.clientname}</p>
              <p>Project Name: {project.projectname}</p>
              <p>Deadline: {project.deadline}</p>
              <p>Budget: {project.budget}</p>
              <p>Member Emails: {project.memberEmails.join(", ")}</p>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsComponent;
