"use client"

import {
	type Event,
	type Member,
	MemberRole,
	type Profile,
} from "@prisma/client"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { UserAvatar } from "@/components/user-avatar"
import { cn } from "@/lib/utils"

type EventMemberProps = {
	member: Member & { profile: Profile }
	event: Event
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
	[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
}

export const EventMember = ({ member }: EventMemberProps) => {
	const params = useParams()
	const router = useRouter()

	const icon = roleIconMap[member.role]

	const onClick = () => {
		router.push(`/events/${params?.eventId}/conversations/${member.id}`)
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group px-2 py-2 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/50 transition mb-1",
				params?.memberId === member.id && "bg-zinc-700",
			)}>
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-8 w-8 md:h-8 md:w-8"
			/>
			<p
				className={cn(
					"font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition max-w-40 truncate",
					params?.memberId === member.id &&
						"text-primary group-hover:text-white",
				)}>
				{member.profile.name}
			</p>
			{icon}
		</button>
	)
}
