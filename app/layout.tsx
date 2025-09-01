import type React from "react";
import "./globals.css";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/app/providers/auth-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: {
    default: "LazyFit - Tavo asmeninis sporto klubas internete",
    template: "%s | LazyFit",
  },
  description:
    "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
  keywords: [
    "sporto klubas",
    "treniruotės",
    "mityba",
    "sportas",
    "sveikata",
    "online treniruotės",
  ],
  openGraph: {
    title: "LazyFit - Tavo asmeninis sporto klubas internete",
    description:
      "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LazyFit",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LazyFit - Tavo asmeninis sporto klubas internete",
    description:
      "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
