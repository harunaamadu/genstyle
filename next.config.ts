import type { NextConfig } from "next";
import * as os from "os";

function getLocalExternalIP(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;

    for (const alias of iface) {
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }

  return ips;
}

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: getLocalExternalIP(),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqylma6u3/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  }
};

export default nextConfig;
