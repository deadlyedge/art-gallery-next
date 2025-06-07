import { redirect } from "next/navigation"

import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

type Props = {
	params: Promise<{
		memberId: string
		eventId: string
	}>
}

const MemberIdPage = async ({ params }: Props) => {
	const profile = await currentProfile()
	const { memberId, eventId } = await params

	if (!profile) {
		return redirect("/sign-in")
	}

	const currentMember = await db.member.findFirst({
		where: {
			eventId: eventId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	})

	if (!currentMember) {
		return redirect("/")
	}

	const conversation = await getOrCreateConversation(currentMember.id, memberId)

	if (!conversation) {
		return redirect(`/events/${eventId}`)
	}

	const { memberOne, memberTwo } = conversation

	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				title={otherMember.profile.name}
				eventId={eventId}
				type="conversation"
			/>

			<ChatMessages
				member={currentMember}
				name={otherMember.profile.name}
				chatId={conversation.id}
				type="conversation"
				apiUrl="/api/direct-messages"
				paramKey="conversationId"
				paramValue={conversation.id}
				// socketUrl="/api/socket/direct-messages"
				messageQuery={{
					conversationId: conversation.id,
				}}
			/>
			<ChatInput
				name={otherMember.profile.name}
				type="conversation"
				apiUrl="/api/direct-messages"
				query={{
					conversationId: conversation.id,
				}}
			/>
		</div>
	)
}

export default MemberIdPage
