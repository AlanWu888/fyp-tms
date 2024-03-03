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
  try {
    const timesheets = await Timesheet.find();
    // console.log(timesheets);
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.log(error);
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

    // Update taskDescription and time if they exist in the updatedFields
    if (updatedFields.taskDescription) {
      timesheet.entries.forEach((entry) => {
        if (entry._id.toString() === updatedFields.entryId) {
          entry.taskDescription = updatedFields.taskDescription;
        }
      });
    }

    if (updatedFields.time) {
      timesheet.entries.forEach((entry) => {
        if (entry._id.toString() === updatedFields.entryId) {
          entry.time = updatedFields.time;
        }
      });
    }

    if (updatedFields.additionalNotes) {
      timesheet.entries.forEach((entry) => {
        if (entry._id.toString() === updatedFields.entryId) {
          entry.additionalNotes = updatedFields.additionalNotes;
        }
      });
    }

    if (updatedFields.projectName) {
      timesheet.entries.forEach((entry) => {
        if (entry._id.toString() === updatedFields.entryId) {
          entry.projectName = updatedFields.projectName;
        }
      });
    }

    if (updatedFields.clientName) {
      timesheet.entries.forEach((entry) => {
        if (entry._id.toString() === updatedFields.entryId) {
          entry.clientName = updatedFields.clientName;
        }
      });
    }

    await timesheet.save();

    return NextResponse.json(
      { message: "Timesheet updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the timesheet" },
      { status: 500 },
    );
  }
}

/*
Find way to filter data at read level
export async function GET(req) {
  try {
    const {name} = req.query;

    console.log(name)
    console.log(userEmail)
    const timesheets = await Timesheet.find({userEmail: "manager_test@bast.com"});
    console.log(timesheets);
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
*/
