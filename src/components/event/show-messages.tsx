"use client"

import type { Member, Message, Profile } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import { Loader2, ServerCrash } from "lucide-react"

import { ChatItem } from "@/components/chat/chat-item"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Suspense } from "react"

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
	paramKey: "contentId" | "conversationId"
	paramValue: string
	type: "content" | "conversation"
}

export const ShowMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	paramKey,
	paramValue,
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`

	const { data, status } = useChatQuery({
		queryKey,
		apiUrl,
		paramKey,
		paramValue,
		refetchIntervalSeconds: 0,
	})

	if (status === "pending") {
		return (
			<div
				key={name}
				className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
				<p className="text-xs text-zinc-400">reading messages...</p>
			</div>
		)
	}

	if (status === "error") {
		return (
			<div
				key={name}
				className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					something wrong.
				</p>
			</div>
		)
	}

	return (
		<div key={name} className="flex-1 flex flex-col overflow-y-auto">
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, index) => (
					<Suspense
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						fallback={
							<Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
						}>
						{group.items
							.slice(0, 5)
							.map((message: MessageWithMemberWithProfile) => (
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
									// apiUrl={apiUrl}
									// messageQuery={socketQuery}
									showMode={true}
								/>
							))}
						{group.items.length > 5 && (
							<div className="text-center text-zinc-300">[more messages]</div>
						)}
					</Suspense>
				))}
			</div>
		</div>
	)
}
