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
  const resetUrl = `${process.env.BASE_URL}/change-password?token=${resetToken}`;

  console.error(resetUrl);

  const body = `
  <html>
	<div style="font-family: Mulish,Helvetica,Arial,sans-serif">
		<div style="margin-bottom: 20px; border-bottom: 1px solid black;">
			<p style="font-weight: bold; color: black">This email is not monitored, so please do not reply to it.</p>
			<p style="color: black" >If you have any issues please contact an administrator</p>
		</div>
		<div style="margin-bottom: 10px;">
			<p style="color: black" >Dear User,</p>
			<p style="color: black" >You have requested to reset your password. Please click on the following link to reset your password:</p>
			<p><a href="${resetUrl}" style="text-decoration: none; color: #007bff;">Reset Password</a></p>
			<p style="color: black" >If the link does not work, please copy and paste this into your browser: </p>
			<p style="text-decoration: none; color: #007bff;">${resetUrl}</p>
		</div>
		<div style="margin-bottom: 10px;">
			<p style="color: black" >If you did not request a password reset, please ignore this email.</p>
		</div>
	</div>
</html>
`;

  const msg = {
    to: email,
    from: "reset.timesheetmanagementsystem@gmail.com",
    subject: "Password Reset Link - Timesheet management system",
    html: body,
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
