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
	founderName: string
}

export const EventHeader = ({ event, role, founderName }: EventHeaderProps) => {
	const { onOpen } = useModal()

	const isAdmin = role === MemberRole.ADMIN
	const isModerator = isAdmin || role === MemberRole.MODERATOR

	return (
		<div className="sticky top-0 z-20 bg-black/40 flex items-center justify-center w-full h-10 gap-2 text-foreground/50 sm:mb-2 backdrop-blur-sm">
			<DropdownMenu>
				<DropdownMenuTrigger className="focus:outline-hidden text-base font-semibold px-3 flex items-center h-10 text-foreground border-neutral-800 hover:text-white hover:bg-zinc-700/50 transition gap-2 max-w-64">
					{/* <button
						type="button"
						className="text-base font-semibold px-3 flex items-center h-10 text-foreground border-neutral-800 hover:text-white hover:bg-zinc-700/50 transition gap-2 max-w-48 truncate"> */}
					<span className="w-64 truncate">{event.title}</span>
					<ChevronDown className="h-5 w-5 ml-auto" />
					{/* </button> */}
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
			<div className="text-xs hidden sm:dark:block">
				{event.createdAt.toLocaleDateString()}
			</div>
			<div className="text-xs hidden md:dark:block">by {founderName}</div>
		</div>
	)
}
