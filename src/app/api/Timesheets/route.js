import Timesheet from "@/app/(models)/timesheet";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const timesheetData = body.formData;
    console.log(JSON.stringify(timesheetData));

    // Confirm all fields have been filled
    if (
      !timesheetData?.userEmail ||
      !timesheetData?.entries ||
      !timesheetData?.date
    ) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await Timesheet.create(timesheetData);
    return NextResponse.json(
      { message: "Timesheet Created." },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { message: "Duplicate timesheet entry" },
        { status: 409 },
      );
    } else {
      // Other errors
      return NextResponse.json(
        { message: "An error occurred while saving the timesheet" },
        { status: 500 },
      );
    }
  }
}

export async function GET() {
  // TODO: need to find a way to get timesheets based on user emails
  try {
    const timesheets = await Timesheet.find({});
    console.log(timesheets);
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
