"use client"

import { useEffect, useState } from "react"

import { CreateContentModal } from "@/components/modals/create-content-modal"
import { CreateEventModal } from "@/components/modals/create-event-modal"
import { DeleteContentModal } from "@/components/modals/delete-content-modal"
import { DeleteEventModal } from "@/components/modals/delete-event-modal"
import { DeleteMessageModal } from "@/components/modals/delete-message-modal"
import { EditContentModal } from "@/components/modals/edit-content-modal"
import { EditEventModal } from "@/components/modals/edit-event-modal"
import { InviteModal } from "@/components/modals/invite-modal"
import { LeaveEventModal } from "@/components/modals/leave-event-modal"
import { MembersModal } from "@/components/modals/members-modal"
import { MessageFileModal } from "@/components/modals/message-file-modal"

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<>
			<CreateEventModal />
			<InviteModal />
			<EditEventModal />
			<MembersModal />
			<CreateContentModal />
			<LeaveEventModal />
			<DeleteEventModal />
			<DeleteContentModal />
			<EditContentModal />
			<MessageFileModal />
			<DeleteMessageModal />
		</>
	)
}
