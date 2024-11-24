import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function DELETE(
  req: Request,
  props: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)

    const eventId = searchParams.get("eventId")

    const { memberId } = await props.params

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!eventId) {
      return new NextResponse("Server ID missing", { status: 400 })
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 })
    }

    const event = await db.event.update({
      where: {
        id: eventId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ memberId: string }> }
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const { role } = await req.json()

    const eventId = searchParams.get("eventId")

    const { memberId } = await props.params

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!eventId) {
      return new NextResponse("Server ID missing", { status: 400 })
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 })
    }

    const event = await db.event.update({
      where: {
        id: eventId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
