import Client from "@/app/(models)/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const clientData = body.formData;

    await Client.create(clientData);
    return NextResponse.json({ message: "Client Created." }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clients = await Client.find({}); // Wait for the query to resolve
    console.log(clients); // Array of all product documents
    return NextResponse.json({ clients }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
