import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        hashedPassword: true,
        provider: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user uses credentials provider (has a password)
    if (user.provider !== "credentials") {
      // For OAuth users, don't require current password - they're setting their first password
      if (currentPassword) {
        return NextResponse.json(
          { error: "OAuth users don't need to provide current password" },
          { status: 400 }
        );
      }
    } else if (user.hashedPassword) {
      // For credentials users with existing password, verify current password
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.hashedPassword
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { email: session.user.email },
      data: { hashedPassword: hashedNewPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}