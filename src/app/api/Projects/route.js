import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const projectData = body.formData;

    //Confirm all fields have been filled
    if (!projectData?.clientname || !projectData?.projectname || !projectData?.deadline || !projectData?.budget || !projectData?.memberEmails) {
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
        return NextResponse.json({ message: "Duplicate Client and Project combination" }, { status: 409 });
      } else {
        // Other errors
        return NextResponse.json({ message: "An error occurred while saving the project" }, { status: 500 });
      }
  }
}

export async function GET() {
  try {
    const projects = await Project.find({});
    console.log(projects);
    return NextResponse.json({ projects }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body=await req.json()
    const {clientname, projectname, newData} = body

    // Check if ProjectId is provided
    if (!clientname || !projectname) {
      return NextResponse.json(
        { message: "Project ID is required." },
        { status: 400 },
      );
    }
    const updatedProject = await Project.findOneAndUpdate({clientname, projectname}, newData, {
      new: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Project updated.", project: updatedProject },
      { status: 200 },
    );
  } catch(error){
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}