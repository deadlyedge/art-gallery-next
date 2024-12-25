"use client"

import { MemberRole } from "@prisma/client"
import { Plus, Settings } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"
import type { EventWithMembersWithProfiles } from "@/types"

type EventSectionProps = {
	label: string
	role?: MemberRole
	sectionType: "contents" | "members"
	// contentType?: ContentType
	event?: EventWithMembersWithProfiles
}

export const EventSection = ({
	label,
	role,
	sectionType,
	// contentType,
	event,
}: EventSectionProps) => {
	const { onOpen } = useModal()
	const contentType = "IMAGE"

	return (
		<div className="flex items-center justify-between py-2 px-2 md:px-0">
			<p className="text-xs uppercase font-semibold">{label}</p>
			{role !== MemberRole.GUEST && sectionType === "contents" && (
				<ActionTooltip label="添加内容" side="top">
					<button
						type="button"
						onClick={() => onOpen("createContent", { contentType })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
						<Plus className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
			{role === MemberRole.ADMIN && sectionType === "members" && (
				<ActionTooltip label="管理成员" side="top">
					<button
						type="button"
						onClick={() => onOpen("members", { event })}
						className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
						<Settings className="h-4 w-4" />
					</button>
				</ActionTooltip>
			)}
		</div>
	)
}
