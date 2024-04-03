"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function ResetPasswordForm() {
  const router = useRouter();

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
        console.error("User with this email is not registered");
      }
      if (res.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
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
