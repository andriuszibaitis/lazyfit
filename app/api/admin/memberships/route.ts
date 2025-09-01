import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const memberships = await prisma.membership.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(memberships);
  } catch (error) {
    console.error("ADMIN_MEMBERSHIPS_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      planId,
      price,
      discountPercentage,
      duration,
      description,
      features,
      isActive,
    } = body;

    if (!name || !planId || !price || !duration) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const existingMembership = await prisma.membership.findUnique({
      where: {
        planId,
      },
    });

    if (existingMembership) {
      return new NextResponse("Narystė su tokiu plano ID jau egzistuoja", {
        status: 400,
      });
    }

    const membership = await prisma.membership.create({
      data: {
        name,
        planId,
        price: Number.parseFloat(price.toString()),
        discountPercentage: discountPercentage || 0,
        duration,
        description,
        features: features || [],
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("ADMIN_CREATE_MEMBERSHIP_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
