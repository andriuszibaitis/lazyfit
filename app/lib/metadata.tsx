import type { Metadata } from "next";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
}

export function generateMetadata({
  title = "LazyFit - Tavo asmeninis sporto klubas internete",
  description = "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
  keywords = [
    "sporto klubas",
    "treniruotės",
    "mityba",
    "sportas",
    "sveikata",
    "online treniruotės",
  ],
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
}: GenerateMetadataProps): Metadata {
  const metadataBase = new URL("https://lazyfit.lt");

  return {
    metadataBase,
    title: title ? `${title} | LazyFit` : "LazyFit",
    description,
    keywords,
    openGraph: {
      title: title ? `${title} | LazyFit` : "LazyFit",
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "LazyFit",
        },
      ],
      type: ogType,
    },
    twitter: {
      card: twitterCard,
      title: title ? `${title} | LazyFit` : "LazyFit",
      description,
      images: [ogImage],
    },
  };
}
