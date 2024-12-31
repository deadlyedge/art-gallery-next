"use client"

import { useModal } from "@/hooks/use-modal-store"
import { SidebarGroupAction } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"

export const NavigationAction = () => {
	const { onOpen } = useModal()

	return (
		<SidebarGroupAction
			title="create event"
			onClick={() => onOpen("createEvent")}
			className="flex items-center text-sm p-0">
			<Plus className="w-4 h-4" />
			{/* add */}
		</SidebarGroupAction>
	)
}
