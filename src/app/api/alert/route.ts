import { connectToDatabase } from "@/database/connection";
import { Alert } from "@/database/models/alert.model";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const alerts = await Alert.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { name, stockIdentifier, type, condition, threshold, frequency } =
      await req.json();
    const newAlert = new Alert({
      userId: session.user.id,
      name,
      stockIdentifier,
      type,
      condition,
      threshold,
      frequency,
    });

    await newAlert.save();

    return NextResponse.json({ success: true, data: newAlert });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
