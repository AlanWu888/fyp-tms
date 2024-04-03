"use client";

import Link from "next/link";
import React from "react";
import Button from "../(components)/buttons/Button";
import { COLOURS } from "@/app/constants";

const Denied = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f8f8",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          color: "#ff0000",
          marginBottom: "20px",
        }}
      >
        Access Denied
      </h1>
      <p
        style={{
          fontSize: "18px",
          color: "#555",
          marginBottom: "10px",
        }}
      >
        You do not have permission to access this page.
      </p>
      <p
        style={{
          fontSize: "18px",
          color: "#555",
          marginBottom: "50px",
        }}
      >
        Please contact your administrator if you believe this is an error.
      </p>
      <Link href="/role-redirect">
        <Button
          colour={COLOURS.WHITE}
          bgcolour={COLOURS.RED}
          label="Take me Back"
        />
      </Link>
    </div>
  );
};

export default Denied;
