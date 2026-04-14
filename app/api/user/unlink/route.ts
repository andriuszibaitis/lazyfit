import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";

// POST - Unlink email or Google
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body; // "email" or "google"

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Vartotojas nerastas" }, { status: 404 });
    }

    // Can only unlink if both are connected
    if (!user.linkedEmail || user.provider !== "google") {
      return NextResponse.json({ error: "Negalima atjungti — turi būti bent vienas prisijungimo būdas" }, { status: 400 });
    }

    if (type === "email") {
      // Remove linked email and password
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          linkedEmail: null,
          hashedPassword: null,
        },
      });
    } else if (type === "google") {
      // Move linkedEmail to primary email, set provider to credentials
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          email: user.linkedEmail,
          linkedEmail: null,
          provider: "credentials",
        },
      });
    }

    return NextResponse.json({ message: "Sėkmingai atjungta" });
  } catch (error) {
    console.error("Error unlinking:", error);
    return NextResponse.json({ error: "Klaida atjungiant" }, { status: 500 });
  }
}
