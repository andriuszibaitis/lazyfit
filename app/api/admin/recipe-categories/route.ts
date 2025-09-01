import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Naudotojas neprisijungęs" }),
        { status: 401 }
      );
    }

    const categories = await prisma.recipeCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Klaida gaunant receptų kategorijas:", error);
    return new NextResponse(
      JSON.stringify({ error: "Įvyko serverio klaida" }),
      { status: 500 }
    );
  }
}
