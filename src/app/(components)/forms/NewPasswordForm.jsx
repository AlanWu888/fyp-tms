"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function NewPasswordForm() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(null);

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
        console.error("Invalid token, or token has expired");
        setVerified(true);
      }
      if (res.status === 200) {
        console.log("Reset sent");
        setVerified(true);
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Error, please try again");
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(JSON.stringify(user));
  }, [user]);

  // check if token is still valid and not expired
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token") || "";
    console.log(tokenParam);

    verifyToken(tokenParam);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target[0].value;
  };

  return (
    <div className="grid place-items-center h-screen bg-indigo-900">
      <div className="shadow-lg p-5 rounded-lg bg-white">
        <h1 className="text-xl font-bold my-4">Change your password</h1>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
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
            className="font-bold cursor-pointer px-6 py-2 bg-blue-400 rounded-lg text-white"
            type="submit"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
