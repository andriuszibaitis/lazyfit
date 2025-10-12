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
      select: {
        id: true,
        membershipStatus: true,
        planId: true,
        membershipExpiry: true,
        membership: {
          select: {
            id: true,
            name: true,
            planId: true,
            price: true,
            duration: true,
            description: true,
            features: true,
            isActive: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all available memberships
    const allMemberships = await prisma.membership.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        planId: true,
        price: true,
        duration: true,
        description: true,
        features: true,
        showOnHomepage: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return NextResponse.json({
      userMembership: user,
      availableMemberships: allMemberships
    });
  } catch (error) {
    console.error("Error fetching membership data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}