import { ContentType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import {
  Hash,
  ImageIcon,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

import { EventHeader } from "@/components/event/event-header"
import { EventSearch } from "@/components/event/event-search"
import { EventSection } from "@/components/event/event-section"
import { EventContent } from "@/components/event/event-content"
import { EventMember } from "@/components/event/event-member"
import { Suspense } from "react"
import Loading from "./loading"

const iconMap = {
  [ContentType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ContentType.IMAGE]: <ImageIcon className='mr-2 h-4 w-4' />,
  [ContentType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
}

const EventContentsPage = async (props: {
  params: Promise<{ eventId: string; contentTitle?: string }>
}) => {
  const profile = await currentProfile()
  const { eventId } = await props.params

  if (!profile) {
    return redirect("/")
  }

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      contents: {
        orderBy: {
          createdAt: "asc",
        },
      },
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

  const members = event?.members.filter(
    (member) => member.profileId !== profile.id
  )

  if (!event) {
    return redirect("/")
  }

  const role = event.members.find(
    (member) => member.profileId === profile.id
  )?.role

  // redirect to hashtag after page fully loaded

  return (
    <div className='flex flex-col h-full'>
      {/* <Suspense fallback={<Loading />}> */}
      <div className='sticky top-0 z-10 bg-black/40 flex items-center justify-center w-full h-10 gap-2 text-foreground/50 mb-2'>
        <EventHeader event={event} role={role} />
        <div className='text-xs'>{event.createdAt.toLocaleString()}</div>
        <div className='text-xs'>by {profile.name}</div>
      </div>
      <ScrollArea className='flex-1 px-0 md:px-3'>
        {!!members?.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='members'
              role={role}
              label='Members'
              event={event}
            />
            <div className='space-y-[2px]'>
              {members.map((member) => (
                <EventMember key={member.id} member={member} event={event} />
              ))}
            </div>
          </div>
        )}
        {!!event?.contents.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='contents'
              // contentType={ContentType.TEXT}
              role={role}
              label='Contents'
            />
            <div className='space-y-[2px]'>
              {event.contents.map((content) => (
                <EventContent
                  key={content.id}
                  content={content}
                  role={role}
                  event={event}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
      {/* </Suspense> */}
    </div>
  )
}

export default EventContentsPage
