import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

// GET - Search food products
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const all = searchParams.get("all") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const products = await prisma.foodProduct.findMany({
      where: {
        isActive: true,
        OR: [
          { isUserCreated: false }, // System products
          { userId: session.user.id }, // User's own products
        ],
        ...(query && !all ? { name: { contains: query } } : {}),
      },
      take: limit,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        category: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        serving: true,
        servingUnit: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching food products:", error);
    return NextResponse.json(
      { error: "Failed to search food products" },
      { status: 500 }
    );
  }
}
