import { currentProfile } from "@/lib/current-profile"
import { describeImage } from "@/lib/openai"
import { type NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
	const profile = await currentProfile()
	if (!profile) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}
	const imageURL = req.nextUrl.searchParams.get("imageURL")
	if (!imageURL) {
		return NextResponse.json("Missing imageURL", { status: 400 })
	}
	// TODO: check if user is subscribed
	const imageDescription = await describeImage(imageURL)
	return NextResponse.json(imageDescription)
}
