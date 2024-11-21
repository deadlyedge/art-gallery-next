import { NextResponse } from "next/server"
import { Message } from "@prisma/client"

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
