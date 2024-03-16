"use client";

import React, { useState, useEffect } from "react";
import LoadingSpinner from "../loading/Loading";
import UserTable from "./UserTable";
import Button from "../buttons/Button";
import { COLOURS } from "@/app/constants";
import Link from "next/link";

const AdminComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userTypes = [
    { value: "user", label: "Employee" },
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
        _id: user._id,
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
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
              Viewing all users
            </div>
            <div>
              <Link
                href={{
                  pathname: `/admin/add-user`,
                }}
              >
                <Button
                  label="Add user"
                  colour={COLOURS.WHITE}
                  bgcolour={COLOURS.GREEN_ENABLED}
                />
              </Link>
            </div>
          </div>

          {userTypes.map((userType) => (
            <div key={userType.value}>
              <UserTable
                userData={users.filter((user) => user.role === userType.value)}
                role={userType.value}
                header={`${userType.label}s (${users.filter((user) => user.role === userType.value).length})`}
                fetchData={fetchData}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComponent;
