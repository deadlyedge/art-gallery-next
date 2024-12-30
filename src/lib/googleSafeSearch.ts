import { ImageAnnotatorClient } from "@google-cloud/vision"

const apiKey = process.env.GOOGLE_VISION_API_KEY
if (!apiKey) {
	throw new Error("GOOGLE_VISION_API_KEY is not set")
}
const client = new ImageAnnotatorClient({ apiKey })

export async function safeSearchPass(
	imageUrl: string,
): Promise<boolean | null> {
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
}
