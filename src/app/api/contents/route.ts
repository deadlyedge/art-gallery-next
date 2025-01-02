import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
	try {
		const profile = await currentProfile()
		const { title, imageUrl, description, isPublic, setEventImage } =
			await req.json()
		const type = "IMAGE"

		const { searchParams } = new URL(req.url)
		const eventId = searchParams.get("eventId")

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!eventId) {
			return new NextResponse("Event ID missing", { status: 400 })
		}

		if (title === "general") {
			return new NextResponse("Name cannot be 'general'", { status: 400 })
		}

		if (setEventImage) {
			await db.event.update({
				where: {
					id: eventId,
					profileId: profile.id,
				},
				data: {
					imageUrl,
				},
			})
		}

		const event = await db.event.update({
			where: {
				id: eventId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				contents: {
					create: {
						profileId: profile.id,
						title,
						type,
						imageUrl,
						description,
						isPublic,
					},
				},
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("CHANNELS_POST", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

const CONTENTS_BATCH = 20
const TOTAL_LANDING_PAGE_SHOWS = 5

export async function GET() {
	try {
		const contents = await db.content.findMany({
			take: CONTENTS_BATCH,
			where: {
				isPublic: true,
			},
			include: {
				profile: true,
			},
		})
		function getRandomElements<T>(arr: Array<T>, count: number): Array<T> {
			return arr.sort(() => Math.random() - 0.5).slice(0, count)
		}

		const randomContents = getRandomElements(contents, TOTAL_LANDING_PAGE_SHOWS)

		return NextResponse.json({
			randomContents,
		})
	} catch (error) {
		console.log("[CONTENTS_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
