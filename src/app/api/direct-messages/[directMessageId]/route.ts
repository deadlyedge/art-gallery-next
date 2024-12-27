import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"

const getDirectMessage = async (
	profileId: string,
	directMessageId: string,
	conversationId: string,
	patching?: boolean,
) => {
	const conversation = await db.conversation.findFirst({
		where: {
			id: conversationId,
			OR: [
				{
					memberOne: { profileId },
				},
				{
					memberTwo: { profileId },
				},
			],
		},
		include: {
			memberOne: {
				include: {
					profile: true,
				},
			},
			memberTwo: {
				include: {
					profile: true,
				},
			},
		},
	})

	if (!conversation) {
		return NextResponse.json("Conversation not found", { status: 404 })
	}

	const member =
		conversation.memberOne.profileId === profileId
			? conversation.memberOne
			: conversation.memberTwo

	if (!member) {
		return NextResponse.json("Member not found", { status: 404 })
	}
	const directMessage = await db.directMessage.findFirst({
		where: {
			id: directMessageId as string,
			conversationId: conversationId as string,
		},
		include: {
			member: {
				include: {
					profile: true,
				},
			},
		},
	})

	if (!directMessage || directMessage.deleted) {
		return NextResponse.json("DirectMessage not found", { status: 404 })
	}

	const isMessageOwner = directMessage.memberId === member.id
	const isAdmin = member.role === MemberRole.ADMIN
	const isModerator = member.role === MemberRole.MODERATOR
	const canModify = isMessageOwner || isAdmin || isModerator

	if (!canModify || (patching && !isMessageOwner)) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}

	return directMessage
}

export async function DELETE(
	req: NextRequest,
	props: { params: Promise<{ directMessageId: string }> },
) {
	const profile = await currentProfile()
	const searchParams = req.nextUrl.searchParams
	const { directMessageId } = await props.params
	const conversationId = searchParams.get("conversationId")

	if (!profile) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}

	if (!conversationId) {
		return NextResponse.json("No Conversation", { status: 400 })
	}
	try {
		let directMessage = await getDirectMessage(
			profile.id,
			directMessageId,
			conversationId,
		)
		directMessage = await db.directMessage.update({
			where: {
				id: directMessageId,
			},
			data: {
				fileUrl: null,
				text: "消息已经被删除.",
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
		return NextResponse.json(directMessage)
	} catch (error) {
		console.log("[DIRECT_MESSAGE_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: NextRequest,
	props: { params: Promise<{ directMessageId: string }> },
) {
	const profile = await currentProfile()
	const searchParams = req.nextUrl.searchParams
	const { text } = await req.json()
	const { directMessageId } = await props.params
	const conversationId = searchParams.get("conversationId")
	if (!profile) {
		return NextResponse.json("Unauthorized", { status: 401 })
	}

	if (!conversationId) {
		return NextResponse.json("No Conversation", { status: 400 })
	}

	try {
		let directMessage = await getDirectMessage(
			profile.id,
			directMessageId,
			conversationId,
		)
		directMessage = await db.directMessage.update({
			where: {
				id: directMessageId,
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

		return NextResponse.json(directMessage)
	} catch (error) {
		console.log("[DIRECT_MESSAGE_PATCH]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
