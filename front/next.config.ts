import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Railway: definir NEXT_PUBLIC_API_URL antes do build (URL pública da API, ex. https://xxx.up.railway.app). */
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
