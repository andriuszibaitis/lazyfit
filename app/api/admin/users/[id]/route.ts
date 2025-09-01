import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse("Vartotojas nerastas", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("ADMIN_GET_USER_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;
    const body = await request.json();
    const {
      name,
      email,
      role,
      emailVerified,
      membershipStatus,
      planId,
      membershipExpiry,
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("Vartotojas nerastas", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
        role: role !== undefined ? role : existingUser.role,
        emailVerified:
          emailVerified !== undefined
            ? emailVerified
              ? new Date()
              : null
            : existingUser.emailVerified,
        membershipStatus:
          membershipStatus !== undefined
            ? membershipStatus
            : existingUser.membershipStatus,
        planId: planId !== undefined ? planId : existingUser.planId,
        membershipExpiry:
          membershipExpiry !== undefined
            ? membershipExpiry
            : existingUser.membershipExpiry,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ADMIN_UPDATE_USER_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = params.id;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("Vartotojas nerastas", { status: 404 });
    }

    if (userId === session.user.id) {
      return new NextResponse("Negalite ištrinti savo paskyros", {
        status: 400,
      });
    }

    await prisma.$transaction([
      prisma.session.deleteMany({
        where: {
          userId: userId,
        },
      }),

      prisma.account.deleteMany({
        where: {
          userId: userId,
        },
      }),

      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("ADMIN_DELETE_USER_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
