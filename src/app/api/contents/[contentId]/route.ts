import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function DELETE(
	req: Request,
	props: { params: Promise<{ contentId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)

		const eventId = searchParams.get("eventId")

		const { contentId } = await props.params

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!eventId) {
			return new NextResponse("Server ID missing", { status: 400 })
		}

		if (!contentId) {
			return new NextResponse("Channel ID missing", { status: 400 })
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
					delete: {
						id: contentId,
						title: {
							not: "general",
						},
					},
				},
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("[CONTENT_ID_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	props: { params: Promise<{ contentId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { title, type, imageUrl, description, isPublic } = await req.json()
		const { searchParams } = new URL(req.url)

		const eventId = searchParams.get("eventId")

		const { contentId } = await props.params

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!eventId) {
			return new NextResponse("Server ID missing", { status: 400 })
		}

		if (!contentId) {
			return new NextResponse("Channel ID missing", { status: 400 })
		}

		if (title === "general") {
			return new NextResponse("Name cannot be 'general'", { status: 400 })
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
					update: {
						where: {
							id: contentId,
							NOT: {
								title: "general",
							},
						},
						data: {
							title,
							type,
							imageUrl,
							description,
							isPublic: !!imageUrl && isPublic,
						},
					},
				},
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("[CHANNEL_ID_PATCH]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
