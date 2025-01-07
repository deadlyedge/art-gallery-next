"use client"

import { type ModalType, useModal } from "@/hooks/use-modal-store"
import type { EventWithMembersWithProfiles } from "@/types"
import { type Content, type Member, MemberRole } from "@prisma/client"
import { Edit, Hash, Lock, Trash } from "lucide-react"
import { ActionTooltip } from "../action-tooltip"

type ContentHeaderProps = {
	content: Content
	member: Member
	event: EventWithMembersWithProfiles
}

export const ContentHeader = ({
	content,
	member,
	event,
}: ContentHeaderProps) => {
	const { onOpen } = useModal()
	const onAction = (e: React.MouseEvent, action: ModalType) => {
		e.stopPropagation()
		onOpen(action, { content, event })
	}

	return (
		<>
			<div className="flex items-center text-zinc-100 p-2 md:p-0">
				<Hash className="flex-shrink-0 w-5 h-5" />
				<p className="line-clamp-1 font-semibold text-sm group-hover:text-zinc-50 transition">
					{content.title}
				</p>
				{content.title !== "general" && member.role !== MemberRole.GUEST && (
					<div className="ml-auto flex items-center gap-x-2">
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
				{content.title === "general" && (
					<Lock className="ml-auto w-4 h-4 text-zinc-400" />
				)}
			</div>
			{content.description && (
				<div className="text-xs h-auto mx-2 md:mx-0 text-zinc-100 mb-2">
					{content.description}
				</div>
			)}
		</>
	)
}
