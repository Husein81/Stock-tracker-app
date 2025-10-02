import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Sign-out is typically handled by NextAuth on the client side
    // This endpoint can be used for additional server-side cleanup if needed
    return NextResponse.json(
      { message: "Sign out successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign out:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
