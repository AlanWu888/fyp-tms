import Timesheet from "@/app/(models)/timesheet";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
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

export async function GET() {
  try {
    const timesheets = await Timesheet.find();
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, updatedFields } = await req.json();

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

export async function DELETE(req) {
  try {
    const { id } = await req.json();

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
