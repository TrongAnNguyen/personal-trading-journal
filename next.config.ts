import type { NextConfig } from "next";
import "./src/env"; // Validate env vars at build time

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
