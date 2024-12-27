import { MemberRole } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next"

import { currentProfilePages } from "@/lib/current-profile-pages"
import { db } from "@/lib/db"
// import type { NextApiResponseServerIO } from "@/types"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "DELETE" && req.method !== "PATCH") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		const profile = await currentProfilePages(req)
		const { messageId, eventId, contentId } = req.query
		const { text } = req.body

		if (!profile) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		if (!eventId) {
			return res.status(400).json({ error: "Server ID missing" })
		}

		if (!contentId) {
			return res.status(400).json({ error: "Channel ID missing" })
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
			return res.status(404).json({ error: "Server not found" })
		}

		const content = await db.content.findFirst({
			where: {
				id: contentId as string,
				eventId: eventId as string,
			},
		})

		if (!content) {
			return res.status(404).json({ error: "Channel not found" })
		}

		const member = event.members.find(
			(member) => member.profileId === profile.id,
		)

		if (!member) {
			return res.status(404).json({ error: "Member not found" })
		}

		let message = await db.message.findFirst({
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
			return res.status(404).json({ error: "Message not found" })
		}

		const isMessageOwner = message.memberId === member.id
		const isAdmin = member.role === MemberRole.ADMIN
		const isModerator = member.role === MemberRole.MODERATOR
		const canModify = isMessageOwner || isAdmin || isModerator

		if (!canModify) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		if (req.method === "DELETE") {
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
		}

		if (req.method === "PATCH") {
			if (!isMessageOwner) {
				return res.status(401).json({ error: "Unauthorized" })
			}

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
		}

		// const updateKey = `chat:${contentId}:messages:update`

		// res?.socket?.server?.io?.emit(updateKey, message)

		return res.status(200).json(message)
	} catch (error) {
		console.log("[MESSAGE_ID]", error)
		return res.status(500).json({ error: "Internal Error" })
	}
}
