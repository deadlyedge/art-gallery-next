import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.zick.me",
        port: "",
        pathname: "/s/**",
      },
    ],
  },
}

export default nextConfig
