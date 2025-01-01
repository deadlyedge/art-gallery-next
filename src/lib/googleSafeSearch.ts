"use server"

import { ImageAnnotatorClient } from "@google-cloud/vision"

const apiKey = process.env.GOOGLE_VISION_API_KEY
if (!apiKey) {
	throw new Error("GOOGLE_VISION_API_KEY is not set")
}

const getGCPCredentials = () => {
	// for Vercel, use environment variables
	return process.env.GCP_PRIVATE_KEY
		? {
				credentials: {
					client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
					private_key: process.env.GCP_PRIVATE_KEY,
				},
				projectId: process.env.GCP_PROJECT_ID,
			}
		: // for local development, use cloud vision api
			{ apiKey }
}

const client = new ImageAnnotatorClient(await getGCPCredentials())

export async function safeSearchPass(
	imageUrl: string,
): Promise<boolean | null> {
	try {
		const [result] = await client.safeSearchDetection(imageUrl)
		const detections = result.safeSearchAnnotation
		if (!detections) return null

		if (
			detections.adult === "VERY_LIKELY" ||
			detections.spoof === "VERY_LIKELY" ||
			detections.medical === "VERY_LIKELY" ||
			detections.violence === "VERY_LIKELY" ||
			detections.racy === "VERY_LIKELY"
		) {
			return false
		}
		// console.log("Safe search:")
		// console.log(`Adult: ${detections.adult}`)
		// console.log(`Medical: ${detections.medical}`)
		// console.log(`Spoofed: ${detections.spoof}`)
		// console.log(`Violence: ${detections.violence}`)
		// console.log(`Racy: ${detections.racy}`)
		return true
	} catch (error) {
		console.log(error)
		throw error
	}
}
