import { connectToDatabase } from "@/database/connection";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/database/models/user.model";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user with this token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      // Redirect to sign-in page with success message
      return NextResponse.redirect(
        new URL("/sign-in?verified=already", request.url)
      );
    }

    // Verify the email
    user.emailVerified = new Date();
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Redirect to sign-in page with success message
    return NextResponse.redirect(
      new URL("/sign-in?verified=success", request.url)
    );
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.redirect(
      new URL("/sign-in?verified=error", request.url)
    );
  }
};
