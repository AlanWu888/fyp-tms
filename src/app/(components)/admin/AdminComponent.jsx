"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "../loading/Loading";
import UserTable from "./UserTable";

const AdminComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const userTypes = [
    { value: "user", label: "Employees" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const responseData = await response.json();
      const usersData = responseData.users;
      const userDetails = usersData.map((user) => ({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      }));
      setUsers(userDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        userTypes.map((userType) => (
          <div key={userType.value}>
            <UserTable
              userData={users.filter((user) => user.role === userType.value)}
              role={userType.value}
              header={`${userType.label}s (${users.filter((user) => user.role === userType.value).length})`}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default AdminComponent;
