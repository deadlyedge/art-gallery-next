import { redirect } from "next/navigation"
import { ContentType } from "@prisma/client"

import { currentProfile } from "@/lib/current-profile"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room"
import { db } from "@/lib/db"

interface ContentIdPageProps {
  params: {
    eventId: string
    contentId: string
  }
}

const ContentIdPage = async ({ params }: ContentIdPageProps) => {
  const profile = await currentProfile()
  const { eventId, contentId } = await params

  if (!profile) {
    return redirect("/sign-in")
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

  if (!content || !member) {
    redirect("/")
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={content.name}
        eventId={content.eventId}
        type='content'
      />
      {content.type === ContentType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={content.name}
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
            name={content.name}
            type='content'
            apiUrl='/api/socket/messages'
            query={{
              contentId: content.id,
              eventId: content.eventId,
            }}
          />
        </>
      )}
      {/* {content.type === ContentType.AUDIO && (
        <MediaRoom chatId={content.id} video={false} audio={true} />
      )}
      {content.type === ContentType.VIDEO && (
        <MediaRoom chatId={content.id} video={true} audio={true} />
      )} */}
    </div>
  )
}

export default ContentIdPage
