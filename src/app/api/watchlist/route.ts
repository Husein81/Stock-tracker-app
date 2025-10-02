import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/database/connection";
import { Watchlist } from "@/database/models/watchlis.model";

// GET - Fetch all watchlist items for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const watchlistItems = await Watchlist.find({
      userId: session.user.id,
    }).sort({ addedAt: -1 });

    return NextResponse.json({
      success: true,
      data: watchlistItems,
      count: watchlistItems.length,
    });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// POST - Add a stock to the watchlist
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { symbol, company } = body;

    if (!symbol || !company) {
      return NextResponse.json(
        { error: "Symbol and company name are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the stock is already in the watchlist
    const existingItem = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Stock is already in your watchlist" },
        { status: 409 }
      );
    }

    // Add the stock to the watchlist
    const newWatchlistItem = await Watchlist.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stock added to watchlist",
        data: newWatchlistItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding to watchlist:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Stock is already in your watchlist" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add stock to watchlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove all items from watchlist (clear watchlist)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const result = await Watchlist.deleteMany({
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Watchlist cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing watchlist:", error);
    return NextResponse.json(
      { error: "Failed to clear watchlist" },
      { status: 500 }
    );
  }
}
