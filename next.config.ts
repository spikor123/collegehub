import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sentinel",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
