"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ role: "none" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.role === "none") {
      alert("Please select a user type.");
      return;
    }

    const res = await fetch(
      `/api/Users?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
      {
        method: "POST",
        body: JSON.stringify({ formData }),
        "content-type": "application/json",
      },
    );

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/admin/home");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create New User</h1>
        <label>First Name</label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.firstname}
          className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
        />

        <label>Last Name</label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.lastname}
          className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
        />
        <label>Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          onChange={handleChange}
          required={true}
          value={formData.capacity}
          className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
        />
        <label>Email</label>
        <input
          id="email"
          name="email"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.email}
          className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
        />
        <label>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          required={true}
          value={formData.password}
          className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
        />
        <label>Role</label>
        <select
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          required={true}
          defaultValue={"none"}
        >
          <option value="none" disabled>
            Select a user type
          </option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">Employee</option>
        </select>
        <input
          type="submit"
          value="Create User"
          className="bg-blue-300 hover:bg-blue-100"
        />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};

export default UserForm;
