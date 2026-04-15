import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/collegehub",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
