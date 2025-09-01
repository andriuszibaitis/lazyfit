import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const membershipId = params.id;
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
      showOnHomepage,
    } = body;

    const existingMembership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
    });

    if (!existingMembership) {
      return new NextResponse("Narystė nerasta", { status: 404 });
    }

    if (planId && planId !== existingMembership.planId) {
      const planExists = await prisma.membership.findUnique({
        where: {
          planId,
        },
      });

      if (planExists) {
        return new NextResponse("Narystė su tokiu plano ID jau egzistuoja", {
          status: 400,
        });
      }
    }

    const updatedMembership = await prisma.membership.update({
      where: {
        id: membershipId,
      },
      data: {
        name: name !== undefined ? name : existingMembership.name,
        planId: planId !== undefined ? planId : existingMembership.planId,
        price:
          price !== undefined
            ? Number.parseFloat(price.toString())
            : existingMembership.price,
        discountPercentage:
          discountPercentage !== undefined
            ? discountPercentage
            : existingMembership.discountPercentage,
        duration:
          duration !== undefined ? duration : existingMembership.duration,
        description:
          description !== undefined
            ? description
            : existingMembership.description,
        features:
          features !== undefined ? features : existingMembership.features,
        isActive:
          isActive !== undefined ? isActive : existingMembership.isActive,
        showOnHomepage:
          showOnHomepage !== undefined
            ? showOnHomepage
            : existingMembership.showOnHomepage,
      },
    });

    console.log("Atnaujinta narystė:", updatedMembership);

    return NextResponse.json(updatedMembership);
  } catch (error) {
    console.error("ADMIN_UPDATE_MEMBERSHIP_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
