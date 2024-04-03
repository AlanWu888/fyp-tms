import LogMessage from "@/app/(models)/logMessage";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    const logMsgData = body;

    await LogMessage.create(logMsgData);
    return NextResponse.json(
      { message: "LogMessage Created." },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }
  try {
    const logMsgs = await LogMessage.find({});
    return NextResponse.json({ logMsgs }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
