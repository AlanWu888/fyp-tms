import Timesheet from "@/app/(models)/timesheet";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const timesheetData = body.formData;

    await Timesheet.create(timesheetData);
    return NextResponse.json(
      { message: "Timesheet Created." },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const timesheets = await Timesheet.find({});
    console.log(timesheets);
    return NextResponse.json({ timesheets }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
