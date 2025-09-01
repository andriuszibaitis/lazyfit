"use client";

import Head from "next/head";
import { useRouter } from "next/router";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "LazyFit - Tavo asmeninis sporto klubas internete",
  description = "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
  keywords = "sporto klubas, treniruotės, mityba, sportas, sveikata, online treniruotės",
  ogImage = "/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
}: SEOProps) {
  const router = useRouter();
  const currentUrl = canonicalUrl || `https://lazyfit.lt${router.asPath}`;
  const fullTitle = `${title} | LazyFit`;
  const keywordsStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  return (
    <Head>
      {/* Pagrindiniai meta tagai */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsStr} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
