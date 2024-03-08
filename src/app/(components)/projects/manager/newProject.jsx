import React from "react";
import Button from "../../buttons/Button"; // Adjust the path to match the actual location of Button component
import Link from "next/link";
import { COLOURS } from "@/app/constants";
import GoBack from "../../buttons/GoBack";

function NewProject() {
  return (
    <div>
      <Link href="/manager/project">
        <GoBack />
      </Link>
    </div>
  );
}

export default NewProject;
