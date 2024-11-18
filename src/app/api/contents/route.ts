import { NextResponse } from "next/server"
import { MemberRole } from "@prisma/client"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const profile = await currentProfile()
    const { name, type, url } = await req.json()
    const { searchParams } = new URL(req.url)

    const eventId = searchParams.get("eventId")

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!eventId) {
      return new NextResponse("Event ID missing", { status: 400 })
    }

    if (name === "general") {
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
          create: {
            profileId: profile.id,
            name,
            type,
            url,
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
