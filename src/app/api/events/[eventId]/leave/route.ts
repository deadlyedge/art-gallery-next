import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.eventId) {
      return new NextResponse("Event ID missing", { status: 400 })
    }

    const event = await db.event.update({
      where: {
        id: params.eventId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("[EVENT_ID_LEAVE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
