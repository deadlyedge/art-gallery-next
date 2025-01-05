import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
	const { filename, contentType } = await request.json()

	try {
		const client = new S3Client({ region: process.env.AWS_REGION })
		const key = uuidv4()

		const { url, fields } = await createPresignedPost(client, {
			Bucket: process.env.AWS_BUCKET_NAME as string,
			Key: key,
			Conditions: [
				["content-length-range", 0, 10 * 1024 * 1024], // up to 10 MB
				["starts-with", "$Content-Type", contentType],
			],
			Fields: {
				acl: "public-read",
				"Content-Type": contentType,
			},
			Expires: 600, // Seconds before the presigned post expires. 3600 by default.
		})

		return NextResponse.json({ url, fields, key })
	} catch (error) {
		return NextResponse.json({ error })
	}
}
