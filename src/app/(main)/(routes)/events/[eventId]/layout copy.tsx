import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"
import { EventSidebar } from "@/components/event/event-sidebar"

const EventIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { eventId: string }
}) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/sign-in')
  }
  const { eventId } = await params

  const event = await db.event.findUnique({
    where: {
      id: eventId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!event) {
    return redirect("/")
  }

  return (
    <div className='h-full'>
      <div className='md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <EventSidebar eventId={eventId} />
      </div>
      <main className='h-full md:pl-80'>{children}</main>
    </div>
  )
}

export default EventIdLayout
