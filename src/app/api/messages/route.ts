import type { Message } from "@prisma/client"
import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)

		const cursor = searchParams.get("cursor")
		const contentId = searchParams.get("contentId")

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!contentId) {
			return new NextResponse("Content ID missing", { status: 400 })
		}

		let messages: Message[] = []

		if (cursor) {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					contentId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			})
		} else {
			messages = await db.message.findMany({
				take: MESSAGES_BATCH,
				where: {
					contentId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			})
		}

		let nextCursor = null

		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id
		}
		// console.log(messages,contentId,cursor,nextCursor)
		return NextResponse.json({
			items: messages,
			nextCursor,
		})
	} catch (error) {
		console.log("[MESSAGES_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function POST(
	req: Request,
	// props: { params: Promise<{ eventId: string; contentId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const { text, fileUrl } = await req.json()
		const eventId = searchParams.get("eventId")
		const contentId = searchParams.get("contentId")

		if (!profile) {
			return NextResponse.json("Unauthorized", { status: 401 })
		}

		if (!eventId) {
			return NextResponse.json("Server ID missing", { status: 400 })
		}

		if (!contentId) {
			return NextResponse.json("Channel ID missing", { status: 400 })
		}

		if (!text) {
			return NextResponse.json("Content missing", { status: 400 })
		}

		const event = await db.event.findFirst({
			where: {
				id: eventId as string,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			include: {
				members: true,
			},
		})

		if (!event) {
			return NextResponse.json("Server not found", { status: 404 })
		}

		const content = await db.content.findFirst({
			where: {
				id: contentId as string,
				eventId: eventId as string,
			},
		})

		if (!content) {
			return NextResponse.json("Content not found", { status: 404 })
		}

		const member = event.members.find(
			(member) => member.profileId === profile.id,
		)

		if (!member) {
			return NextResponse.json("Member not found", { status: 404 })
		}

		const message = await db.message.create({
			data: {
				text,
				fileUrl,
				contentId: contentId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		})

		return NextResponse.json(message)
	} catch (error) {
		console.log("[MESSAGE_POST]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
