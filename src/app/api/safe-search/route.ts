import { currentProfile } from "@/lib/current-profile"
import { safeSearchPass } from "@/lib/googleSafeSearch"
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

	if (await safeSearchPass(imageURL)) {
		return NextResponse.json("Safe", { status: 200 })
	}
	return NextResponse.json("Not Safe", { status: 222 })
}
