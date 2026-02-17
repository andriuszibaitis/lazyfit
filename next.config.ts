import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
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
