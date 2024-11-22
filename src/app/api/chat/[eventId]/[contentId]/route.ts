import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { eventId: string; contentId: string } }
) {
  try {
    const profile = await currentProfile()

    const { eventId, contentId } = await params

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!eventId) {
      return new NextResponse("Event ID missing", { status: 400 })
    }

    if (!contentId) {
      return new NextResponse("Content ID missing", { status: 400 })
    }

    const content = await db.content.findUnique({
      where: {
        id: contentId,
      },
    })

    const member = await db.member.findFirst({
      where: {
        eventId: eventId,
        profileId: profile.id,
      },
    })

    return NextResponse.json({ content, member })
  } catch (error) {
    console.log("[GET_CONTENT_AND_MEMBER_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
