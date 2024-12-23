import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

const InviteCodePage = async (props: {
  params: Promise<{inviteCode: string}>
}) => {
  const profile = await currentProfile()
  const inviteCode = (await props.params).inviteCode

  if (!profile) {
    return redirect("/sign-in")
  }

  if (!inviteCode) {
    return redirect("/")
  }

  const existingEvent = await db.event.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (existingEvent) {
    return redirect(`/events/${existingEvent.id}`)
  }

  const event = await db.event.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })

  if (event) {
    return redirect(`/events/${event.id}`)
  }

  return null
}

export default InviteCodePage
