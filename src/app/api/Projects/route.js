import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const projectData = body.formData;

    //Confirm all fields have been filled
    if (
      !projectData?.clientname ||
      !projectData?.projectname ||
      !projectData?.deadline ||
      !projectData?.budget ||
      !projectData?.memberEmails
    ) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    await Project.create(projectData);
    return NextResponse.json({ message: "Project Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { message: "Duplicate Client and Project combination" },
        { status: 409 },
      );
    } else {
      // Other errors
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
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// need to find a way to delete users from the memberEmails too
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { clientname, projectname, newData } = body;

    // Check if clientname and projectname are provided
    if (!clientname || !projectname) {
      return NextResponse.json(
        { message: "Client name and project name are required." },
        { status: 400 },
      );
    }

    let updatedProject;

    // If newData contains memberEmails, handle them
    if (newData && newData.memberEmails) {
      // Find the existing project
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

      // Remove duplicates from newData.memberEmails and append them
      const uniqueMemberEmails = [...new Set(newData.memberEmails)];

      // Update newData with unique memberEmails
      newData.memberEmails = uniqueMemberEmails;

      // Merge newData with existing project data
      updatedProject = await Project.findOneAndUpdate(
        { clientname, projectname },
        { $addToSet: newData },
        { new: true },
      );
    } else {
      // If newData does not contain memberEmails, update the project directly
      updatedProject = await Project.findOneAndUpdate(
        { clientname, projectname },
        newData,
        { new: true },
      );
    }

    // Check if project exists and return the updated project
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
    console.log(error);
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

    // Check if clientname and projectname are provided
    if (!clientname || !projectname) {
      return NextResponse.json(
        { message: "Client name and project name are required." },
        { status: 400 },
      );
    }

    // Find the project to delete
    const deletedProject = await Project.findOneAndDelete({
      clientname,
      projectname,
    });

    // Check if project exists and return the deleted project
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
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the project." },
      { status: 500 },
    );
  }
}
