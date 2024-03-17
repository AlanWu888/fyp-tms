"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("role-redirect");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-indigo-900">
      <div
        className="shadow-lg p-5 rounded-lg bg-white"
        style={{ width: "450px" }}
      >
        <h1 className="text-xl font-bold my-4">
          Sign into Timesheet Management System
        </h1>
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            className="rounded-md border border-gray-200 py-2 px-6 bg-zinc-100/40"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="font-bold cursor-pointer px-6 py-2 bg-blue-400 rounded-lg text-white mt-6">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <div className="text-sm mt-3 text-right">
            Forgot your password?{" "}
            <Link href={"/reset-password"}>
              <span className="underline">Click Here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
