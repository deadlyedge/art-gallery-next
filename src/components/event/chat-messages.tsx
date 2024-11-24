"use client"

import { Fragment, useRef, ElementRef } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { Member, Message, Profile } from "@prisma/client"
import { Loader2, ServerCrash } from "lucide-react"

import { useChatQuery } from "@/hooks/use-chat-query"
import { useChatSocket } from "@/hooks/use-chat-socket"
import { useChatScroll } from "@/hooks/use-chat-scroll"

import { ChatWelcome } from "@/components/chat/chat-welcome"
import { ChatItem } from "@/components/chat/chat-item"
import { Button } from "@/components/ui/button"

// const DATE_FORMAT = "MMM d, yyyy, HH:mm"

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

type ChatMessagesProps = {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: "contentId" | "conversationId"
  paramValue: string
  type: "content" | "conversation"
}

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })
  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === "pending") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>reading messages...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>something wrong.</p>
      </div>
    )
  }

  return (
    <div ref={chatRef} className='flex-1 flex flex-col overflow-y-auto'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <ChatWelcome type={type} title={name} />}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
          ) : (
            <Button
            variant='link'
              onClick={() => fetchNextPage()}
              className='text-xs my-2 py-0'>
              read more messages...
            </Button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                text={message.text}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={formatDistanceToNow(message.createdAt)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef}/>
    </div>
  )
}
