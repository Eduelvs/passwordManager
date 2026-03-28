import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Opcional: embute NEXT_PUBLIC no bundle; o cliente também usa GET /api/config + API_URL em runtime. */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
