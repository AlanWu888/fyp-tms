import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const projectData = body.formData;

    if (
      !projectData?.clientname ||
      !projectData?.projectname ||
      !projectData?.deadline ||
      !projectData?.budget ||
      !projectData?.memberEmails ||
      !projectData?.removedEmails
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    await Project.create(projectData);
    return NextResponse.json({ message: "Project Created." }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Duplicate Client and Project combination" },
        { status: 409 },
      );
    } else {
      return NextResponse.json(
        { message: "An error occurred while saving the project" },
        { status: 500 },
      );
    }
  }
}

export async function GET() {
  try {
    const projects = await Project.find({});
    return NextResponse.json({ projects }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { clientname, projectname, newData } = body;

    if (!clientname || !projectname) {
      return NextResponse.json(
        { message: "Client name and project name are required." },
        { status: 400 },
      );
    }

    let updatedProject;

    const existingProject = await Project.findOne({
      clientname,
      projectname,
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 },
      );
    }

    updatedProject = await Project.findOneAndUpdate(
      { clientname, projectname },
      newData,
      { new: true },
    );

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Project updated.", project: updatedProject },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while updating the project." },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { clientname, projectname } = body;

    if (!clientname || !projectname) {
      return NextResponse.json(
        { message: "Client name and project name are required." },
        { status: 400 },
      );
    }

    const deletedProject = await Project.findOneAndDelete({
      clientname,
      projectname,
    });

    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Project deleted.", project: deletedProject },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the project." },
      { status: 500 },
    );
  }
}
