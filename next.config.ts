import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
			},
			{
				protocol: "https",
				hostname: "file.zick.me",
			},
			{
				protocol: "https",
				hostname: "f.zick.xyz",
			},
			{
				protocol: "https",
				hostname: "uploadthing.com",
			},
		],
	},
}

export default nextConfig
