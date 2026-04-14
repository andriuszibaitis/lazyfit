import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Get file extension
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${session.user.id}-${Date.now()}.${ext}`;
    const filePath = path.join(process.cwd(), "public", "uploads", "avatars", fileName);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const imageUrl = `/uploads/avatars/${fileName}`;

    // Delete old avatar file if exists
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { image: true },
    });

    if (currentUser?.image?.startsWith("/uploads/avatars/")) {
      const oldPath = path.join(process.cwd(), "public", currentUser.image);
      try { await unlink(oldPath); } catch {}
    }

    // Update user's image in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    });

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete avatar file if exists
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { image: true },
    });

    if (currentUser?.image?.startsWith("/uploads/avatars/")) {
      const filePath = path.join(process.cwd(), "public", currentUser.image);
      try { await unlink(filePath); } catch {}
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: null },
    });

    return NextResponse.json({
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Error removing avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
