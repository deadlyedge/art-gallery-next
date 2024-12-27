import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

const getMessage = async (
	profileId: string,
	messageId: string,
	eventId: string,
	contentId: string,
	patching?: boolean,
) => {
	const event = await db.event.findFirst({
		where: {
			id: eventId as string,
			members: {
				some: {
					profileId,
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

	const member = event.members.find((member) => member.profileId === profileId)

	if (!member) {
		return NextResponse.json("Member not found", { status: 404 })
	}

	const message = await db.message.findFirst({
		where: {
			id: messageId as string,
			contentId: contentId as string,
		},
		include: {
			member: {
				include: {
					profile: true,
				},
			},
		},
	})

	if (!message || message.deleted) {
		return NextResponse.json("Message not found", { status: 404 })
	}

	const isMessageOwner = message.memberId === member.id
	const isAdmin = member.role === MemberRole.ADMIN
	const isModerator = member.role === MemberRole.MODERATOR
	const canModify = isMessageOwner || isAdmin || isModerator

	if (!canModify || (patching && !isMessageOwner)) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}
	return message
}
export async function DELETE(
	req: Request,
	props: { params: Promise<{ messageId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		// const { text } = await req.json()
		const { messageId } = await props.params

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

		let message = await getMessage(profile.id, messageId, eventId, contentId)

		message = await db.message.update({
			where: {
				id: messageId as string,
			},
			data: {
				fileUrl: null,
				text: "这条消息已经被删除.",
				deleted: true,
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
		console.log("[MESSAGE_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	props: { params: Promise<{ messageId: string }> },
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const { text } = await req.json()
		const { messageId } = await props.params

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

		let message = await getMessage(profile.id, messageId, eventId, contentId)

		message = await db.message.update({
			where: {
				id: messageId as string,
			},
			data: {
				text,
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
		console.log("[MESSAGE_PATCH]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
