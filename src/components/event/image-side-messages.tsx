"use client"

import { Content, Member } from "@prisma/client"

import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
// import { MediaRoom } from "@/components/media-room"
import axios from "axios"
import { useEffect, useState } from "react"

type ImageSideChatProps = {
  eventId: string
  contentId: string
}

export const ImageSideChat = ({ eventId, contentId }: ImageSideChatProps) => {
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
      {/* <ChatHeader
        title={content.title}
        eventId={content.eventId}
        type='content'
      /> */}
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
      {/* <ChatInput
        name={content.title}
        type='content'
        apiUrl='/api/socket/messages'
        query={{
          contentId: content.id,
          eventId: content.eventId,
        }}
      /> */}
    </div>
  )
}
