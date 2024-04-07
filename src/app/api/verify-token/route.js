import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (request) => {
  const { token } = await request.json();
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  if (password !== process.env.NEXT_PUBLIC_API_TOKEN) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 },
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return new NextResponse(`Invalid token, or token has expired`, {
      status: 400,
    });
  }
  return new NextResponse(JSON.stringify(user), { status: 200 });
};
