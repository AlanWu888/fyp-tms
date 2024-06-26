import Task from "@/app/(models)/task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const taskData = body.formData;

    await Task.create(taskData);
    return NextResponse.json({ message: "Task Created." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { taskId, taskUpdates } = await req.json();

    const { taskDescription } = taskUpdates;
    const existingTask = await Task.findOne({ taskDescription });

    if (existingTask && existingTask._id.toString() !== taskId) {
      return NextResponse.json(
        { message: "Task description already exists." },
        { status: 400 },
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdates, {
      new: true,
    });

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task updated successfully.", updatedTask },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const tasks = await Task.find({});
    return NextResponse.json({ tasks }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { taskId } = await req.json();

    const existingTask = await Task.findById(taskId);

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    await Task.findByIdAndDelete(taskId);

    return NextResponse.json(
      { message: "Task deleted successfully.", deletedTask: existingTask },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
