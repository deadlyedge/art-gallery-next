import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await db.event.delete({
      where: {
        id: params.eventId,
        profileId: profile.id,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("[EVENT_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const profile = await currentProfile()
    const { title, imageUrl } = await req.json()

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await db.event.update({
      where: {
        id: params.eventId,
        profileId: profile.id,
      },
      data: {
        title,
        imageUrl,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("[EVENT_ID_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
