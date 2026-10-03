import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Needed when `next dev` is reached via nginx / public host instead of localhost.
  allowedDevOrigins: [
    "212.109.194.23",
    "goldenroe.fvds.ru",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
