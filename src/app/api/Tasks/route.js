import Task from "@/app/(models)/task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const taskData = body.formData;

    await Task.create(taskData);
    return NextResponse.json({ message: "Task Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await Task.find({});
    console.log(tasks);
    return NextResponse.json({ tasks }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
