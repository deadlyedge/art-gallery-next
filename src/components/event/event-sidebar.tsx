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

import { EventHeader } from "./event-header"
import { EventSearch } from "./event-search"
import { EventSection } from "./event-section"
import { EventContent } from "./event-content"
import { EventMember } from "./event-member"

type EventSidebarProps = {
  eventId: string
}

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

export const EventSidebar = async ({ eventId }: EventSidebarProps) => {
  const profile = await currentProfile()

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

  const textContents = event?.contents.filter(
    (content) => content.type === ContentType.TEXT
  )
  const audioContents = event?.contents.filter(
    (content) => content.type === ContentType.IMAGE
  )
  const videoContents = event?.contents.filter(
    (content) => content.type === ContentType.VIDEO
  )
  const members = event?.members.filter(
    (member) => member.profileId !== profile.id
  )

  if (!event) {
    return redirect("/")
  }

  const role = event.members.find(
    (member) => member.profileId === profile.id
  )?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <EventHeader event={event} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <EventSearch
            data={[
              {
                label: "文字频道",
                type: "content",
                data: textContents?.map((content) => ({
                  id: content.id,
                  name: content.name,
                  icon: iconMap[content.type],
                })),
              },
              {
                label: "音频频道",
                type: "content",
                data: audioContents?.map((content) => ({
                  id: content.id,
                  name: content.name,
                  icon: iconMap[content.type],
                })),
              },
              {
                label: "视频频道",
                type: "content",
                data: videoContents?.map((content) => ({
                  id: content.id,
                  name: content.name,
                  icon: iconMap[content.type],
                })),
              },
              {
                label: "成员",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textContents?.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='contents'
              contentType={ContentType.TEXT}
              role={role}
              label='文字频道'
            />
            <div className='space-y-[2px]'>
              {textContents.map((content) => (
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
        {!!audioContents?.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='contents'
              contentType={ContentType.IMAGE}
              role={role}
              label='音频频道'
            />
            <div className='space-y-[2px]'>
              {audioContents.map((content) => (
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
        {!!videoContents?.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='contents'
              contentType={ContentType.VIDEO}
              role={role}
              label='视频频道'
            />
            <div className='space-y-[2px]'>
              {videoContents.map((content) => (
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
        {!!members?.length && (
          <div className='mb-2'>
            <EventSection
              sectionType='members'
              role={role}
              label='成员'
              event={event}
            />
            <div className='space-y-[2px]'>
              {members.map((member) => (
                <EventMember key={member.id} member={member} event={event} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
