import { redirect } from "next/navigation"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

interface EventIdPageProps {
  params: {
    eventId: string
  }
}

const EventIdPage = async ({ params }: EventIdPageProps) => {
  const profile = await currentProfile()
  const { eventId } = await params

  if (!profile) {
    return redirect("/sign-in")
  }

  const event = await db.event.findUnique({
    where: {
      id: eventId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      contents: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  const initialContent = event?.contents[0]

  if (initialContent?.name !== "general") {
    return null
  }

  return redirect(`/events/${eventId}/contents/${initialContent?.id}`)
}

export default EventIdPage
