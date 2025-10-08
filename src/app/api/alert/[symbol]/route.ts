import { connectToDatabase } from "@/database/connection";
import { Alert } from "@/database/models/alert.model";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: "Stock symbol is required" },
        { status: 400 }
      );
    }

    const alerts = await Alert.find({
      userId: session.user.id,
      stockIdentifier: symbol,
    });

    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { symbol } = await params;
    const { name, type, condition, threshold, frequency } = await req.json();
    console.log("Updating alert with ID:", symbol, {
      name,
      type,
      condition,
      threshold,
      frequency,
    });
    const updatedAlert = await Alert.findOneAndUpdate(
      { _id: symbol, userId: session.user.id, name },
      { type, condition, threshold, frequency },
      { new: true }
    );

    if (!updatedAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAlert);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { symbol } = await params;
    console.log("Deleting alert with ID:", symbol);
    if (!symbol) {
      return NextResponse.json(
        { error: "Alert ID is required" },
        { status: 400 }
      );
    }

    const deletedAlert = await Alert.findOneAndDelete({
      _id: symbol,
      userId: session.user.id,
    });

    if (!deletedAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
