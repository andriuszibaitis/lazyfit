import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Sesija atnaujinta",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("REFRESH_SESSION_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
