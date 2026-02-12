import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateAuthenticatedEmbedUrl, parseBunnyUrl } from "@/lib/bunny";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { videoUrl, userId } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Video URL is required" },
        { status: 400 }
      );
    }

    const videoInfo = parseBunnyUrl(videoUrl);
    if (!videoInfo.isValid) {
      return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
    }

    const authenticatedUrl = generateAuthenticatedEmbedUrl(videoUrl, {
      userId,
      autoplay: true,
      responsive: true,
    });

    return NextResponse.json({ authenticatedUrl });
  } catch (error) {
    console.error("Error authenticating video URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
