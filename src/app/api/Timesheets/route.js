import Timesheet from "@/app/(models)/timesheet";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    const timesheetData = body.formData;

    if (
      !timesheetData?.userEmail ||
      !timesheetData?.clientName ||
      !timesheetData?.projectName ||
      !timesheetData?.taskDescription ||
      !timesheetData?.date ||
      !timesheetData?.taskType
    ) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    try {
      await Timesheet.create(timesheetData);
      return NextResponse.json(
        { message: "Timesheet Created." },
        { status: 201 },
      );
    } catch (error) {
      if (error.code === 11000) {
        return NextResponse.json(
          { message: "Duplicate entry found." },
          { status: 400 },
        );
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          "An error occurred while saving the timesheet. Please try again later.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const timesheets = await Timesheet.find();
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const { id, updatedFields } = await request.json();

    if (!id || !updatedFields) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const timesheet = await Timesheet.findById(id);

    if (!timesheet) {
      return NextResponse.json(
        { message: "Timesheet not found" },
        { status: 404 },
      );
    }

    if (updatedFields.clientName) {
      timesheet.clientName = updatedFields.clientName;
    }
    if (updatedFields.projectName) {
      timesheet.projectName = updatedFields.projectName;
    }
    if (updatedFields.taskDescription) {
      timesheet.taskDescription = updatedFields.taskDescription;
    }
    if (updatedFields.time) {
      timesheet.time = updatedFields.time;
    }
    if (updatedFields.taskType) {
      timesheet.taskType = updatedFields.taskType;
    }

    await timesheet.save();

    return NextResponse.json(
      { message: "Timesheet updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while updating the timesheet" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Missing id field" },
        { status: 400 },
      );
    }

    const deletedTimesheet = await Timesheet.findByIdAndDelete(id);

    if (!deletedTimesheet) {
      return NextResponse.json(
        { message: "Timesheet not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Timesheet deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the timesheet" },
      { status: 500 },
    );
  }
}
