import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
	req: Request,
	props: { params: Promise<{ eventId: string; contentId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { text, fileUrl } = await req.json()
		const { eventId, contentId } = await props.params

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
			return NextResponse.json("Channel not found", { status: 404 })
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
	} catch (error) {}
}
