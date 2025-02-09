import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This option allows production builds to complete even if there are ESLint errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
