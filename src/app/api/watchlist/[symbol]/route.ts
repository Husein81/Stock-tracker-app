import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/database/connection";
import { Watchlist } from "@/database/models/watchlis.model";

// GET - Check if a specific stock is in the watchlist
export async function GET(
  req: NextRequest,
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

    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const watchlistItem = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    return NextResponse.json({
      success: true,
      isInWatchlist: !!watchlistItem,
      data: watchlistItem,
    });
  } catch (error) {
    console.error("Error checking watchlist status:", error);
    return NextResponse.json(
      { error: "Failed to check watchlist status" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a specific stock from the watchlist
export async function DELETE(
  req: NextRequest,
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

    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedItem = await Watchlist.findOneAndDelete({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (!deletedItem) {
      return NextResponse.json(
        { error: "Stock not found in watchlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stock removed from watchlist",
      data: deletedItem,
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove stock from watchlist" },
      { status: 500 }
    );
  }
}
