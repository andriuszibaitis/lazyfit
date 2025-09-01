import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";

const BUNNY_STREAM_TOKEN = process.env.BUNNY_STREAM_TOKEN || "";
const TOKEN_EXPIRATION_TIME = 3600;

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

    const videoInfo = extractBunnyVideoInfo(videoUrl);
    if (!videoInfo.videoId) {
      return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
    }

    const authenticatedUrl = generateAuthenticatedUrl(
      videoInfo.videoId,
      videoInfo.libraryId,
      userId
    );

    return NextResponse.json({ authenticatedUrl });
  } catch (error) {
    console.error("Error authenticating video URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function extractBunnyVideoInfo(url: string) {
  let libraryId = "";
  let videoId = "";

  if (!url) return { libraryId, videoId };

  if (url.includes("iframe.mediadelivery.net/embed/")) {
    const parts = url.split("/embed/")[1].split("/");
    if (parts.length >= 2) {
      libraryId = parts[0];
      videoId = parts[1].split("?")[0];
    }
  } else if (url.includes("iframe.mediadelivery.net/embed/")) {
    const parts = url.split("/embed/")[1].split("/");
    if (parts.length >= 2) {
      libraryId = parts[0];
      videoId = parts[1].split("?")[0];
    }
  } else if (url.includes("b-cdn.net")) {
    const urlParts = url.split("/");
    if (urlParts.length >= 5) {
      const libraryPart = urlParts[2];
      if (libraryPart.startsWith("vz-")) {
        libraryId = libraryPart.substring(3).split(".")[0];
      }
      videoId = urlParts[3];
    }
  }

  return { libraryId, videoId };
}

function generateAuthenticatedUrl(
  videoId: string,
  libraryId: string,
  userId: string
) {
  if (!videoId || !libraryId) {
    return "";
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = currentTime + TOKEN_EXPIRATION_TIME;

  const tokenParams = {
    exp: expirationTime,
    uid: userId,
  };

  const tokenParamsString = new URLSearchParams(
    Object.entries(tokenParams).map(([key, value]) => [key, String(value)])
  ).toString();

  const signature = crypto
    .createHmac("sha256", BUNNY_STREAM_TOKEN)
    .update(tokenParamsString)
    .digest("hex");

  let baseUrl = "";
  if (libraryId && videoId) {
    baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
  }

  const authenticatedUrl = `${baseUrl}?${tokenParamsString}&token=${signature}&autoplay=true&responsive=true`;

  return authenticatedUrl;
}
