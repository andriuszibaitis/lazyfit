/**
 * Bunny.net kliento pusės utilitos
 * Naudoti React komponentuose (client components)
 */

export interface BunnyVideoInfo {
  videoId: string;
  libraryId: string;
  isValid: boolean;
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
 * Konvertuoja play URL į embed URL
 */
export function convertPlayToEmbed(url: string): string {
  if (!url) return url;
  return url.replace("/play/", "/embed/");
}

/**
 * Generuoja video embed URL su parametrais
 */
export function buildVideoEmbedUrl(
  videoUrl: string | null | undefined,
  options: { autoplay?: boolean; responsive?: boolean; muted?: boolean } = {}
): string | null {
  if (!videoUrl) return null;

  const { autoplay = false, responsive = true, muted = false } = options;

  let embedUrl = convertPlayToEmbed(videoUrl);

  // Pridedame parametrus jei jų nėra
  const hasQuery = embedUrl.includes("?");
  const params: string[] = [];

  if (!embedUrl.includes("autoplay=")) {
    params.push(`autoplay=${autoplay}`);
  }

  if (!embedUrl.includes("responsive=")) {
    params.push(`responsive=${responsive}`);
  }

  if (muted && !embedUrl.includes("muted=")) {
    params.push(`muted=${muted}`);
  }

  if (params.length > 0) {
    embedUrl += (hasQuery ? "&" : "?") + params.join("&");
  }

  return embedUrl;
}

/**
 * Tikrina ar video URL yra apribotas (membership)
 */
export function isVideoRestricted(videoUrl: string | null | undefined): boolean {
  return videoUrl === "restricted";
}

/**
 * Gauna autentifikuotą video URL per API
 * Naudoti kai reikia serverio pusės autentifikacijos
 */
export async function fetchAuthenticatedVideoUrl(
  videoUrl: string,
  userId?: string
): Promise<string | null> {
  try {
    const response = await fetch("/api/video/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate video URL");
    }

    const data = await response.json();
    return data.authenticatedUrl || null;
  } catch (error) {
    console.error("[BUNNY] Klaida gaunant autentifikuotą URL:", error);
    return null;
  }
}

/**
 * Sukuria iframe elementą Bunny video
 */
export function createBunnyIframeProps(
  videoUrl: string,
  options: { autoplay?: boolean; responsive?: boolean } = {}
) {
  const embedUrl = buildVideoEmbedUrl(videoUrl, options);

  return {
    src: embedUrl,
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true,
    style: {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: "0.5rem",
    },
  };
}

/**
 * Wrapper stiliai video konteineriui (16:9 aspect ratio)
 */
export const videoContainerStyles = {
  position: "relative" as const,
  paddingTop: "56.25%", // 16:9 aspect ratio
  width: "100%",
  height: 0,
  backgroundColor: "#001021",
  borderRadius: "0.5rem",
  overflow: "hidden",
};
