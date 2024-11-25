import { redirect } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile"

import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ContentHeader } from "@/components/content/content-header"

const ContentIdPage = async (props: {
  params: Promise<{ eventId: string; contentId: string }>
}) => {
  const profile = await currentProfile()
  const { eventId, contentId } = await props.params

  if (!profile) {
    return redirect("/sign-in")
  }

  const content = await db.content.findUnique({
    where: {
      id: contentId,
    },
  })

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

  const member = await db.member.findFirst({
    where: {
      eventId: eventId,
      profileId: profile.id,
    },
  })

  if (!content || !member || !event) {
    redirect("/")
  }

  const hasImage =
    content.imageUrl !== null && content.title !== "general"
      ? content.imageUrl
      : event.imageUrl

  return (
    <div
      // onClick={onClick}
      className='group/content px-0 md:px-2 py-2 rounded-md md:flex items-start justify-start gap-x-2 w-full mb-1'>
      <div className='w-full md:w-1/2'>
        {hasImage && (
          <Image
            src={hasImage}
            alt='Content Image'
            width={0}
            height={0}
            sizes='100vw'
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </div>

      <div className='w-full md:w-1/2 flex flex-col'>
        <ContentHeader content={content} member={member} event={event} />
        <div className='flex flex-col'>
          <ChatMessages
            member={member}
            name={content.title}
            chatId={content.id}
            type='content'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              contentId: content.id,
              eventId: content.eventId,
            }}
            paramKey='contentId'
            paramValue={content.id}
          />
          <ChatInput
            name={content.title}
            type='content'
            apiUrl='/api/socket/messages'
            query={{
              contentId: content.id,
              eventId: content.eventId,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentIdPage
