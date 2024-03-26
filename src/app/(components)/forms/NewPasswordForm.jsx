"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordUpdatedModal from "./modals/PasswordUpdatedModal";

export default function NewPasswordForm() {
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const verifyToken = async (tokenParam) => {
    try {
      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenParam,
        }),
      });
      if (res.status === 400) {
        setError("Invalid token, or token has expired");
      }
      if (res.status === 200) {
        setVerified(true);
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      setError("Error occurred, please try again");
      console.error("Error occurred while verifying token:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPassword = e.target[0].value;
    const confirmPassword = e.target[1].value;

    if (!user) {
      setError("User object is not set");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
      );
      return;
    }

    try {
      const response = await fetch("/api/Users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          newData: {
            password: newPassword,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the user");
      }

      setError(null);
      setPasswordError(null);
      setShowModal(true);
    } catch (error) {
      setError("Error updating password, please try again");
      console.error("Error updating password:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token") || "";

    verifyToken(tokenParam);
  }, []);

  const isStrongPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="grid place-items-center h-screen bg-indigo-900">
      <div
        className="shadow-lg p-5 rounded-lg bg-white"
        style={{ width: "450px" }}
      >
        <h1 className="text-xl font-bold my-4">Change your password</h1>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {passwordError && (
          <div className="text-red-600 mb-4">{passwordError}</div>
        )}
        {verified && (
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <p className="text-sm">Enter your new password:</p>
            <input
              className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
              type="password"
              placeholder="New Password"
            />

            <p className="text-sm">Confirm your new password:</p>
            <input
              className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
              type="password"
              placeholder="Confirm Password"
            />

            <button
              className="font-bold cursor-pointer px-6 py-2 bg-blue-400 rounded-lg text-white mt-6"
              type="submit"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
      {showModal && (
        <PasswordUpdatedModal
          onClose={() => {
            setShowModal(false);
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
