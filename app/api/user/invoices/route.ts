import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        date: true,
        amount: true,
        currency: true,
        status: true,
        description: true,
        membershipName: true,
        pdfUrl: true
      }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}