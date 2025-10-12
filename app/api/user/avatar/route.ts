import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";

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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // For now, we'll just return a mock URL
    // In a real implementation, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Get the uploaded file URL
    // 3. Save that URL to the database

    const mockImageUrl = `/uploads/avatars/${session.user.email}-${Date.now()}.jpg`;

    // Update user's image in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: mockImageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    });

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      imageUrl: mockImageUrl,
      user: updatedUser
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

    // Remove avatar from user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: null },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    });

    return NextResponse.json({
      message: "Avatar removed successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error removing avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}