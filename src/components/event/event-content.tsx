"use client"

import { type Content, type Event, MemberRole } from "@prisma/client"
import { Edit, Eye, EyeClosed, Hash, Lock, Trash } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { ActionTooltip } from "@/components/action-tooltip"
import { type ModalType, useModal } from "@/hooks/use-modal-store"
import { EventSideMessages } from "./event-side-messages"
import { EventSlidePhoto } from "./event-slide-photo"

type EventContentProps = {
	content: Content
	event: Event
	role?: MemberRole
}

export const EventContent = ({ content, event, role }: EventContentProps) => {
	const { onOpen } = useModal()
	const router = useRouter()

	const onClick = () => {
		router.push(`/events/${event.id}/contents/${content.id}`)
	}

	const onAction = (e: React.MouseEvent, action: ModalType) => {
		e.stopPropagation()
		onOpen(action, { content, event })
	}

	const hasImage =
		content.imageUrl !== null && content.title !== "general"
			? content.imageUrl
			: event.imageUrl

	return (
		<div
			key={content.id}
			className="group/content px-0 md:px-2 py-2 rounded-md md:flex items-start justify-start gap-x-2 w-full mb-1">
			<div className="w-full sticky top-0 md:w-1/2">
				{content.title !== "general" ? (
					<Image
						src={hasImage}
						alt="Content Image"
						width={0}
						height={0}
						sizes="100vw"
						style={{ width: "100%", height: "auto" }}
					/>
				) : (
					<EventSlidePhoto eventId={event.id} />
				)}
			</div>
			{/* drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] */}
			<div
				className="sticky top-0 w-full md:w-1/2 flex flex-col cursor-pointer bg-background/50"
				onClick={onClick}>
				<div className="flex items-center p-2 md:p-0 text-zinc-100">
					<Hash className="shrink-0 w-5 h-5" />
					<p className="line-clamp-1 font-semibold text-sm group-hover:text-zinc-600  dark:group-hover:text-zinc-300 transition">
						{content.title}
					</p>
					{content.title !== "general" && role !== MemberRole.GUEST && (
						<div className="ml-auto flex items-center gap-x-2">
							{content.isPublic ? (
								<ActionTooltip label="Content could be seen on homepage">
									<Eye className="w-4 h-4 text-zinc-400" />
								</ActionTooltip>
							) : (
								<ActionTooltip label="Private Content">
									<EyeClosed className="w-4 h-4 text-zinc-400" />
								</ActionTooltip>
							)}
							<ActionTooltip label="编辑">
								<Edit
									onClick={(e) => onAction(e, "editContent")}
									className="hidden group-hover/content:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition"
								/>
							</ActionTooltip>
							<ActionTooltip label="删除">
								<Trash
									onClick={(e) => onAction(e, "deleteContent")}
									className="hidden group-hover/content:block w-4 h-4 text-zinc-400 hover:text-zinc-300 transition"
								/>
							</ActionTooltip>
						</div>
					)}
					{content.title === "general" && role === MemberRole.ADMIN && (
						<div className="ml-auto flex items-center gap-x-2">
							<ActionTooltip label="编辑">
								<Edit
									onClick={(e) => onAction(e, "editEvent")}
									className="hidden group-hover/content:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
								/>
							</ActionTooltip>
							<ActionTooltip label="事件内容不能从这里删除">
								<Lock className="ml-auto w-4 h-4 text-zinc-400" />
							</ActionTooltip>
						</div>
					)}
				</div>
				{content.description && (
					<div className="text-xs h-auto mx-2 md:mx-0 text-zinc-100 mb-2">
						{content.description}
					</div>
				)}

				<div className="text-xs h-auto">
					<EventSideMessages eventId={event.id} contentId={content.id} />
				</div>
			</div>
		</div>
	)
}
