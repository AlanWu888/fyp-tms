import User from "@/app/(models)/user";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

export const POST = async (req) => {
  const { email } = await req.json();

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return new NextResponse("Email does not exist", { status: 400 });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const passwordResetExpires = Date.now() + 3600000;

  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetUrl = `${process.env.BASE_URL}/change-password/token=${resetToken}`;

  console.log(resetUrl);

  const body = "Reset your password by click on the following URL: " + resetUrl;
  const msg = {
    to: email,
    from: "reset.fyiweubbwfbuheiiwqefihb@gmail.com",
    subject: "Reset Password",
    text: body,
  };

  sgMail.setApiKey(process.env.SENDGRID_API || "");
  sgMail
    .send(msg)
    .then(() => {
      return new NextResponse("Password Reset email sent", { status: 200 });
    })
    .catch(async (error) => {
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;

      await existingUser.save();
      return new NextResponse("Failed to send Password Reset email", {
        status: 400,
      });
    });

  try {
    await existingUser.save();
    return new NextResponse("The email to reset your password has been sent", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(error, { status: 500 });
  }
};
