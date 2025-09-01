import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Išjungiame vaizdo optimizaciją, kad išvengtume kešavimo problemų
    unoptimized: true,
  },
  // Nurodome kešo direktoriją tame pačiame diske, kur yra projektas
  distDir: ".next",
};

export default nextConfig;
