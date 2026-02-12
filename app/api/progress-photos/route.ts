import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";
import { put } from "@vercel/blob";

// GET - Get user's progress photos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const photos = await prisma.progressPhoto.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching progress photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress photos" },
      { status: 500 }
    );
  }
}

// POST - Upload progress photos
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const date = formData.get("date") as string;
    const frontFile = formData.get("front") as File | null;
    const sideFile = formData.get("side") as File | null;
    const backFile = formData.get("back") as File | null;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    if (!frontFile && !sideFile && !backFile) {
      return NextResponse.json(
        { error: "At least one photo is required" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const files = [frontFile, sideFile, backFile].filter(Boolean) as File[];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG and WebP are allowed." },
          { status: 400 }
        );
      }
      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large. Maximum size is 10MB." },
          { status: 400 }
        );
      }
    }

    // Upload files to Vercel Blob
    const uploadFile = async (file: File, type: string) => {
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const filename = `progress-photos/${session.user.id}/${type}-${timestamp}.${extension}`;
      const blob = await put(filename, file, { access: "public" });
      return blob.url;
    };

    const frontUrl = frontFile ? await uploadFile(frontFile, "front") : undefined;
    const sideUrl = sideFile ? await uploadFile(sideFile, "side") : undefined;
    const backUrl = backFile ? await uploadFile(backFile, "back") : undefined;

    // Parse date
    const photoDate = new Date(date);
    photoDate.setUTCHours(0, 0, 0, 0);

    const startOfDay = new Date(photoDate);
    const endOfDay = new Date(photoDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Check if photo entry exists for this date
    const existingPhoto = await prisma.progressPhoto.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let progressPhoto;

    if (existingPhoto) {
      // Update existing entry
      progressPhoto = await prisma.progressPhoto.update({
        where: { id: existingPhoto.id },
        data: {
          frontUrl: frontUrl || existingPhoto.frontUrl,
          sideUrl: sideUrl || existingPhoto.sideUrl,
          backUrl: backUrl || existingPhoto.backUrl,
        },
      });
    } else {
      // Create new entry
      progressPhoto = await prisma.progressPhoto.create({
        data: {
          userId: session.user.id,
          date: photoDate,
          frontUrl,
          sideUrl,
          backUrl,
        },
      });
    }

    return NextResponse.json(progressPhoto);
  } catch (error) {
    console.error("Error uploading progress photos:", error);
    return NextResponse.json(
      { error: "Failed to upload progress photos" },
      { status: 500 }
    );
  }
}
