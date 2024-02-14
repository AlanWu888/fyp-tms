import Project from "@/app/(models)/project";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const projectData = body.formData;

    await Project.create(projectData);
    return NextResponse.json({ message: "Project Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
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
