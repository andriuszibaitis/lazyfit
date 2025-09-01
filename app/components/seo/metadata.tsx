"use client";

import { useEffect } from "react";

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export default function Metadata({
  title = "LazyFit - Tavo asmeninis sporto klubas internete",
  description = "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
  keywords = "sporto klubas, treniruotės, mityba, sportas, sveikata, online treniruotės",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
}: MetadataProps) {
  useEffect(() => {
    document.title = `${title} | LazyFit`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    const keywordsStr = Array.isArray(keywords)
      ? keywords.join(", ")
      : keywords;
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywordsStr);
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = keywordsStr;
      document.head.appendChild(meta);
    }

    updateMetaTag("property", "og:title", `${title} | LazyFit`);
    updateMetaTag("property", "og:description", description);
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "og:type", ogType);

    updateMetaTag("name", "twitter:title", `${title} | LazyFit`);
    updateMetaTag("name", "twitter:description", description);
    updateMetaTag("name", "twitter:image", ogImage);
    updateMetaTag("name", "twitter:card", twitterCard);

    const currentUrl = canonicalUrl || window.location.href;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute("href", currentUrl);
    } else {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      canonicalTag.setAttribute("href", currentUrl);
      document.head.appendChild(canonicalTag);
    }
  }, [
    title,
    description,
    keywords,
    ogImage,
    ogType,
    twitterCard,
    canonicalUrl,
  ]);

  const updateMetaTag = (
    attrName: string,
    attrValue: string,
    content: string
  ) => {
    const metaTag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (metaTag) {
      metaTag.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute(attrName, attrValue);
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  return null;
}
