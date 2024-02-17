import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// get all users
export async function GET() {
  try {
    const users = await User.find({});
    console.log(users);
    return NextResponse.json({ users }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// add a new user
export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;

    //Confirm data exists
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    // check for duplicate emails
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
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// edit user details
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, newData } = body; // userId and newData sent in the request body

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    // If there's a new password provided, hash it
    if (newData.password) {
      newData.password = await bcrypt.hash(newData.password, 10);
    }

    // Update the user
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
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

// delete a user
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId } = body; // Assuming you'll send userId in the request body

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted.", user: deletedUser },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
