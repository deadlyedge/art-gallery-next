"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { ActionTooltip } from "@/components/action-tooltip"
import { cn } from "@/lib/utils"

type NavigationItemProps = {
	id: string
	imageUrl: string
	title: string
}

export const NavigationItem = ({
	id,
	imageUrl,
	title,
}: NavigationItemProps) => {
	const params = useParams()
	const router = useRouter()

	const onClick = () => {
		router.push(`/events/${id}`)
	}

	return (
		<ActionTooltip side="right" align="center" label={title}>
			<button
				type="button"
				onClick={onClick}
				className="group/tooltip relative flex items-center">
				<div
					className={cn(
						"absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
						params?.eventId !== id && "group-hover/tooltip:h-[20px]",
						params?.eventId === id ? "h-[36px]" : "h-[8px]",
					)}
				/>
				<div
					className={cn(
						"relative group/tooltip flex mx-3 h-[120px] w-[200px] group-hover/tooltip:rounded-[16px] transition-all overflow-hidden",
						params?.eventId === id
							? "bg-primary/10 text-primary"
							: "opacity-50",
					)}>
					<Image
						src={imageUrl}
						alt="Content"
						width={0}
						height={0}
						sizes="(max-width: 768px) 60vw, (max-width: 1200px) 30vw, 20vw"
						style={{ width: "100%", height: "auto", objectFit: "cover" }}
					/>
					<div className="absolute w-full h-[120px] mx-auto mt-10 text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] truncate p-1">
						{title}
					</div>
				</div>
			</button>
		</ActionTooltip>
	)
}
