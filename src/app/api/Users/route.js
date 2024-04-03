import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

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
    const userData = body.formData;

    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Email" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    await User.create(userData);
    return NextResponse.json({ message: "User Created." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(request) {
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
    const { userId, newData } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, newData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated.", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(request) {
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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted.", user: deletedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
