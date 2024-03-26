import Client from "@/app/(models)/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const clientData = body.formData;
    const existingClient = await Client.findOne({ name: clientData.name });

    if (existingClient) {
      return NextResponse.json(
        { message: "Client with the same name already exists." },
        { status: 400 },
      );
    }

    await Client.create(clientData);
    return NextResponse.json({ message: "Client Created." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clients = await Client.find({});
    return NextResponse.json({ clients }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, newName } = await req.json();
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { message: "Client not found." },
        { status: 404 },
      );
    }
    if (client.name === newName) {
      return NextResponse.json(
        { message: "New name is the same as the existing name." },
        { status: 400 },
      );
    }

    const existingClient = await Client.findOne({ name: newName });
    if (existingClient) {
      return NextResponse.json(
        { message: "Client with the proposed name already exists." },
        { status: 400 },
      );
    }

    client.name = newName;
    await client.save();

    return NextResponse.json(
      { message: "Client name updated." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Client ID is required." },
        { status: 400 },
      );
    }

    await Client.findByIdAndDelete(id);
    return NextResponse.json({ message: "Client Deleted." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
