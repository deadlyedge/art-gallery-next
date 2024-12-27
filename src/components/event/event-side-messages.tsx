"use client"

import type { Content, Member } from "@prisma/client"

// import { MediaRoom } from "@/components/media-room"
import axios from "axios"
import { useEffect, useState } from "react"
import { ShowMessages } from "./show-messages"

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

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get(`/api/chat/${eventId}/${contentId}`)
			setContentAndMember(res.data)
		}
		fetchData()
	}, [eventId, contentId])

	if (!contentAndMember) {
		return <div>Loading...</div> // Handle the loading state
	}

	const { content, member } = contentAndMember

	return (
		<div className="flex flex-col h-full">
			<ShowMessages
				member={member}
				name={content.title}
				chatId={content.id}
				type="content"
				apiUrl="/api/messages"
				// socketUrl="/api/socket/messages"
				// socketQuery={{
				// 	contentId: content.id,
				// 	eventId: content.eventId,
				// }}
				paramKey="contentId"
				paramValue={content.id}
			/>
		</div>
	)
}
