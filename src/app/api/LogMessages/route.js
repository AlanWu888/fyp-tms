import LogMessage from "@/app/(models)/logMessage";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const logMsgData = body;

    await LogMessage.create(logMsgData);
    return NextResponse.json(
      { message: "LogMessage Created." },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const logMsgs = await LogMessage.find({});
    console.log(logMsgs);
    return NextResponse.json({ logMsgs }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
