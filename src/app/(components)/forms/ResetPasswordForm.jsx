"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === 400) {
        setError("User with this email is not registered");
      }
      if (res.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <div className="grid place-items-center h-screen bg-indigo-900">
      <div
        className="shadow-lg p-5 rounded-lg bg-white"
        style={{ width: "450px" }}
      >
        <h1 className="text-xl font-bold my-4">Reset your password</h1>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <p className="text-sm">
            Enter the email associated with your account:
          </p>
          <input
            className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
            type="text"
            placeholder="Email"
          />
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-1 rounded relative mb-4">
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
          )}
          <p className="text-sm">
            You should get an email with instructions on how to reset your
            password
          </p>
          <button
            className="font-bold cursor-pointer px-6 py-2 bg-blue-400 rounded-lg text-white mt-6"
            type="submit"
          >
            Reset
          </button>

          <div className="text-sm mt-3 text-right">
            Return to login screen?{" "}
            <Link href={"/"}>
              <span className="underline">Click Here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
