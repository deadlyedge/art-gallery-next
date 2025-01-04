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
			{
				protocol: "https",
				hostname: "aganx-images.s3.ap-east-1.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "aganx-images-bucket.s3.ap-northeast-1.amazonaws.com",
			},
		],
	},
}

export default nextConfig
