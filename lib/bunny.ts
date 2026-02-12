import crypto from "crypto";

// Bunny.net konfigūracija
const BUNNY_CONFIG = {
  streamToken: process.env.BUNNY_STREAM_TOKEN || "",
  cdnDomain: "vz-01a4b1c4-97f.b-cdn.net",
  defaultExpiration: 3600, // 1 valanda
};

// Tipai
export interface BunnyVideoInfo {
  videoId: string;
  libraryId: string;
  isValid: boolean;
}

export interface AuthenticatedUrlOptions {
  autoplay?: boolean;
  responsive?: boolean;
  expirationTime?: number; // sekundėmis
  userId?: string;
}

export interface ThumbnailOptions {
  expirationTime?: number;
  width?: number;
  height?: number;
}

/**
 * Ištraukia video ID ir library ID iš įvairių Bunny.net URL formatų
 */
export function parseBunnyUrl(url: string | null | undefined): BunnyVideoInfo {
  const result: BunnyVideoInfo = {
    videoId: "",
    libraryId: "",
    isValid: false,
  };

  if (!url) return result;

  try {
    // Formatas: iframe.mediadelivery.net/embed/{libraryId}/{videoId}
    if (url.includes("iframe.mediadelivery.net/embed/")) {
      const parts = url.split("/embed/")[1]?.split("/");
      if (parts && parts.length >= 2) {
        result.libraryId = parts[0];
        result.videoId = parts[1].split("?")[0];
        result.isValid = true;
      }
    }
    // Formatas: iframe.mediadelivery.net/play/{libraryId}/{videoId}
    else if (url.includes("iframe.mediadelivery.net/play/")) {
      const parts = url.split("/play/")[1]?.split("/");
      if (parts && parts.length >= 2) {
        result.libraryId = parts[0];
        result.videoId = parts[1].split("?")[0];
        result.isValid = true;
      }
    }
    // Formatas: vz-{libraryId}.b-cdn.net/{videoId}/...
    else if (url.includes("b-cdn.net")) {
      const urlObj = new URL(url);
      const hostParts = urlObj.hostname.split(".");
      const pathParts = urlObj.pathname.split("/").filter(Boolean);

      if (hostParts[0]?.startsWith("vz-")) {
        result.libraryId = hostParts[0].substring(3).split("-")[0];
      }

      if (pathParts.length > 0) {
        // Video ID gali būti pirmas path segmentas arba failo pavadinime
        result.videoId = pathParts[0];
        result.isValid = true;
      }
    }
  } catch (error) {
    console.error("[BUNNY] Klaida apdorojant URL:", error);
  }

  return result;
}

/**
 * Tikrina ar URL yra Bunny.net video
 */
export function isBunnyUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("b-cdn.net") ||
    url.includes("iframe.mediadelivery.net") ||
    url.includes("bunnycdn") ||
    url.includes("bunny.net")
  );
}

/**
 * Generuoja autentifikuotą embed URL su token
 */
export function generateAuthenticatedEmbedUrl(
  videoUrl: string,
  options: AuthenticatedUrlOptions = {}
): string {
  const {
    autoplay = false,
    responsive = true,
    expirationTime = BUNNY_CONFIG.defaultExpiration,
    userId,
  } = options;

  const videoInfo = parseBunnyUrl(videoUrl);

  if (!videoInfo.isValid || !videoInfo.videoId || !videoInfo.libraryId) {
    console.warn("[BUNNY] Nepavyko išgauti video informacijos iš URL:", videoUrl);
    return videoUrl;
  }

  if (!BUNNY_CONFIG.streamToken) {
    console.warn("[BUNNY] BUNNY_STREAM_TOKEN nenustatytas");
    // Grąžiname paprastą embed URL be autentifikacijos
    return buildSimpleEmbedUrl(videoInfo.libraryId, videoInfo.videoId, { autoplay, responsive });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expTime = currentTime + expirationTime;

  // Sukuriame token parametrus
  const tokenParams: Record<string, string> = {
    exp: String(expTime),
  };

  if (userId) {
    tokenParams.uid = userId;
  }

  const tokenParamsString = new URLSearchParams(tokenParams).toString();

  // Generuojame HMAC parašą
  const signature = crypto
    .createHmac("sha256", BUNNY_CONFIG.streamToken)
    .update(tokenParamsString)
    .digest("hex");

  // Sukuriame galutinį URL
  const baseUrl = `https://iframe.mediadelivery.net/embed/${videoInfo.libraryId}/${videoInfo.videoId}`;
  const queryParams = new URLSearchParams({
    ...tokenParams,
    token: signature,
    autoplay: String(autoplay),
    responsive: String(responsive),
  });

  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Generuoja paprastą embed URL be autentifikacijos
 */
function buildSimpleEmbedUrl(
  libraryId: string,
  videoId: string,
  options: { autoplay?: boolean; responsive?: boolean } = {}
): string {
  const { autoplay = false, responsive = true } = options;
  const baseUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
  const params = new URLSearchParams({
    autoplay: String(autoplay),
    responsive: String(responsive),
  });
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generuoja autentifikuotą thumbnail URL
 */
export function generateAuthenticatedThumbnailUrl(
  videoUrl: string,
  options: ThumbnailOptions = {}
): string {
  const { expirationTime = BUNNY_CONFIG.defaultExpiration } = options;

  const videoInfo = parseBunnyUrl(videoUrl);

  if (!videoInfo.isValid || !videoInfo.videoId) {
    return "/placeholder.svg?height=300&width=400";
  }

  if (!BUNNY_CONFIG.streamToken) {
    // Grąžiname paprastą thumbnail URL be autentifikacijos
    return `https://${BUNNY_CONFIG.cdnDomain}/${videoInfo.videoId}/thumbnail.jpg`;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expTime = currentTime + expirationTime;

  // Sukuriame token
  const tokenData = `${BUNNY_CONFIG.streamToken}${videoInfo.videoId}${expTime}`;
  const token = crypto.createHash("sha256").update(tokenData).digest("hex");

  // Sukuriame URL su token
  const thumbnailUrl = `https://${BUNNY_CONFIG.cdnDomain}/${videoInfo.videoId}/thumbnail.jpg?token=${token}&expires=${expTime}`;

  return thumbnailUrl;
}

/**
 * Konvertuoja play URL į embed URL
 */
export function convertPlayToEmbed(url: string): string {
  if (!url) return url;
  return url.replace("/play/", "/embed/");
}

/**
 * Generuoja video URL su parametrais (klientui)
 */
export function buildVideoEmbedUrl(
  videoUrl: string | null | undefined,
  options: { autoplay?: boolean; responsive?: boolean } = {}
): string | null {
  if (!videoUrl) return null;

  const { autoplay = false, responsive = true } = options;

  let embedUrl = convertPlayToEmbed(videoUrl);

  // Pridedame parametrus jei jų nėra
  const separator = embedUrl.includes("?") ? "&" : "?";
  const params = [];

  if (!embedUrl.includes("autoplay=")) {
    params.push(`autoplay=${autoplay}`);
  }

  if (!embedUrl.includes("responsive=")) {
    params.push(`responsive=${responsive}`);
  }

  if (params.length > 0) {
    embedUrl += separator + params.join("&");
  }

  return embedUrl;
}

/**
 * Serverio pusės helper - generuoja thumbnail su autentifikacija
 * Naudoti tik serveryje (server components, API routes)
 */
export function getServerThumbnail(videoUrl: string | null | undefined): string {
  if (!videoUrl) {
    return "/placeholder.svg?height=300&width=400";
  }

  if (!isBunnyUrl(videoUrl)) {
    return "/placeholder.svg?height=300&width=400";
  }

  return generateAuthenticatedThumbnailUrl(videoUrl);
}

/**
 * Tikrina ar video URL yra apribotas (membership)
 */
export function isVideoRestricted(videoUrl: string | null | undefined): boolean {
  return videoUrl === "restricted";
}

// Eksportuojame konfigūraciją (be slapto token)
export const bunnyConfig = {
  cdnDomain: BUNNY_CONFIG.cdnDomain,
  defaultExpiration: BUNNY_CONFIG.defaultExpiration,
  hasToken: !!BUNNY_CONFIG.streamToken,
};
