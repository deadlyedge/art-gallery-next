"use client"

import type { EventWithMembersWithProfiles } from "@/types"
import { MemberRole } from "@prisma/client"
import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	UserPlus,
	Users,
} from "lucide-react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "@/hooks/use-modal-store"

type EventHeaderProps = {
	event: EventWithMembersWithProfiles
	role?: MemberRole
	profileName: string
}

export const EventHeader = ({ event, role, profileName }: EventHeaderProps) => {
	const { onOpen } = useModal()

	const isAdmin = role === MemberRole.ADMIN
	const isModerator = isAdmin || role === MemberRole.MODERATOR

	return (
		<div className="sticky top-0 z-20 bg-black/40 flex items-center justify-center w-full h-10 gap-2 text-foreground/50 mb-2 backdrop-blur">
			<DropdownMenu>
				<DropdownMenuTrigger className="focus:outline-none truncate" asChild>
					<button
						type="button"
						className="text-base font-semibold px-3 flex items-center h-10 text-foreground border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 hover:dark:text-white dark:hover:bg-zinc-700/50 transition gap-2">
						{event.title}
						<ChevronDown className="h-5 w-5 ml-auto" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
					{isModerator && (
						<DropdownMenuItem
							onClick={() => onOpen("invite", { event })}
							className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
							Invite Friends
							<UserPlus className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{isAdmin && (
						<DropdownMenuItem
							onClick={() => onOpen("editEvent", { event })}
							className="px-3 py-2 text-sm cursor-pointer">
							Event Edit
							<Settings className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{isAdmin && (
						<DropdownMenuItem
							onClick={() => onOpen("members", { event })}
							className="px-3 py-2 text-sm cursor-pointer">
							Member Manage
							<Users className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{isModerator && (
						<DropdownMenuItem
							onClick={() => onOpen("createContent")}
							className="px-3 py-2 text-sm cursor-pointer">
							Create Content
							<PlusCircle className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{isModerator && <DropdownMenuSeparator />}
					{isAdmin && (
						<DropdownMenuItem
							onClick={() => onOpen("deleteEvent", { event })}
							className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
							Remove Event
							<Trash className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
					{!isAdmin && (
						<DropdownMenuItem
							onClick={() => onOpen("leaveEvent", { event })}
							className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
							Leave Event
							<LogOut className="h-4 w-4 ml-auto" />
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="text-xs">{event.createdAt.toLocaleDateString()}</div>
			<div className="text-xs">by {profileName}</div>
		</div>
	)
}
