import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  distDir: '.next',
  // Add this to handle client-side routing
  trailingSlash: true,
}

export default nextConfig;
