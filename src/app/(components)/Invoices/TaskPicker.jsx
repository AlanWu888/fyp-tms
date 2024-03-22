"use client";

import React, { useState, useEffect } from "react";
import { COLOURS } from "@/app/constants";
import Link from "next/link";
import Button from "../buttons/Button";
import GoBack from "../buttons/GoBack";

function TaskPicker() {
  return (
    <div>
      <div>
        <Link href="manager/invoice">
          <GoBack />
        </Link>
      </div>
    </div>
  );
}

export default TaskPicker;
