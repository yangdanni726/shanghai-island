import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/shanghai-island",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
