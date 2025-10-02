import { connectToDatabase } from "@/database/connection";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/database/models/user.model";
import {
  generateVerificationToken,
  getVerificationExpiry,
} from "@/lib/generateToken";
import { sendVerificationEmail } from "@/lib/nodemailer";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { message: "No user found with this email" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpiry;
    await user.save();

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.fullName,
        verificationUrl,
      });

      return NextResponse.json(
        { message: "Verification email sent successfully" },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
