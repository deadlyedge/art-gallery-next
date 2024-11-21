import { NextApiRequest } from "next"

import { NextApiResponseServerIO } from "@/types"
import { currentProfilePages } from "@/lib/current-profile-pages"
import { db } from "@/lib/db"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const profile = await currentProfilePages(req)
    const { text, fileUrl } = req.body
    const { eventId, contentId } = req.query

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!eventId) {
      return res.status(400).json({ error: "Server ID missing" })
    }

    if (!contentId) {
      return res.status(400).json({ error: "Channel ID missing" })
    }

    if (!text) {
      return res.status(400).json({ error: "Content missing" })
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
      return res.status(404).json({ message: "Server not found" })
    }

    const content = await db.content.findFirst({
      where: {
        id: contentId as string,
        eventId: eventId as string,
      },
    })

    if (!content) {
      return res.status(404).json({ message: "Channel not found" })
    }

    const member = event.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res.status(404).json({ message: "Member not found" })
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

    const contentKey = `chat:${contentId}:messages`

    res?.socket?.server?.io?.emit(contentKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log("[MESSAGES_POST]", error)
    return res.status(500).json({ message: "Internal Error" })
  }
}
