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
      const res = await fetch(
        `/api/verify-token?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenParam,
          }),
        },
      );
      if (res.status === 400) {
        setError("Your password reset link is invalid, or has expired.");
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
      setError("User could not be found");
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
      const response = await fetch(
        `/api/Users?password=${process.env.NEXT_PUBLIC_API_TOKEN}`,
        {
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
        },
      );

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

  const closeError = () => {
    setError(null);
  };

  const closePasswordError = () => {
    setPasswordError(null);
  };

  return (
    <div className="grid place-items-center h-screen bg-indigo-900">
      {error && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative">
            <span className="block sm:inline text-sm">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-1">
              <svg
                onClick={closeError}
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        </div>
      )}
      {passwordError && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative">
            <span className="block sm:inline text-sm">{passwordError}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-1">
              <svg
                onClick={closePasswordError}
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        </div>
      )}
      <div
        className="shadow-lg p-5 rounded-lg bg-white"
        style={{ width: "450px" }}
      >
        <h1 className="text-xl font-bold my-4">Change your password</h1>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
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
