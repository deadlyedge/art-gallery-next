"use client"

import { Content, Member } from "@prisma/client"

import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ShowMessages } from "./show-messages"
// import { MediaRoom } from "@/components/media-room"
import axios from "axios"
import { useEffect, useState } from "react"

type EventSideMessagesProps = {
  eventId: string
  contentId: string
}

export const EventSideMessages = ({
  eventId,
  contentId,
}: EventSideMessagesProps) => {
  const [contentAndMember, setContentAndMember] = useState<{
    content: Content
    member: Member
  } | null>(null)

  const fetchData = async () => {
    const res = await axios.get(`/api/chat/${eventId}/${contentId}`)
    setContentAndMember(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!contentAndMember) {
    return <div>Loading...</div> // Handle the loading state
  }

  const { content, member } = contentAndMember

  return (
    <div className='flex flex-col h-full'>
      <ShowMessages
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
    </div>
  )
}
