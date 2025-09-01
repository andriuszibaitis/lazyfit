import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const memberships = await prisma.membership.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    console.log("API: Rastos narystės:", memberships.length);
    console.log(
      "API: Narystės rodomos pagrindiniame:",
      memberships.filter((m) => m.showOnHomepage).length
    );

    const serializedMemberships = memberships.map((membership) => ({
      ...membership,
      price: Number(membership.price),
      createdAt: membership.createdAt.toISOString(),
      updatedAt: membership.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedMemberships);
  } catch (error) {
    console.error("MEMBERSHIPS_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
