import { connectToDatabase } from "@/database/connection";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/database/models/user.model";
import {
  generateVerificationToken,
  getVerificationExpiry,
} from "@/lib/generateToken";
import { sendVerificationEmail } from "@/lib/nodemailer";

export const POST = async (request: NextRequest, res: NextResponse) => {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      password,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
      emailVerified: null, // Not verified yet
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpiry,
    });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail({
        email: user.email,
        name: user.fullName,
        verificationUrl,
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Don't fail registration if email fails, but log it
    }

    const {
      password: _,
      emailVerificationToken: __,
      ...userData
    } = user.toObject();

    return NextResponse.json(
      {
        user: userData,
        message:
          "Registration successful! Please check your email to verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
