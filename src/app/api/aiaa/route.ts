import { currentProfile } from "@/lib/current-profile"
import { describeImage } from "@/lib/gpt"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: Request) => {
	const profile = await currentProfile()
	if (!profile) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}
	// const searchParams = req.nextUrl.searchParams
	const { imageURL } = await req.json()
	console.log(imageURL)
	if (!imageURL) {
		return NextResponse.json("Missing imageURL", { status: 400 })
	}
	// TODO: check if user is subscribed
	const imageDescription = await describeImage(imageURL)
	return NextResponse.json(imageDescription)
}

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
