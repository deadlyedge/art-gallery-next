"use client"

import { Plus } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"

export const NavigationAction = () => {
	const { onOpen } = useModal()

	return (
		<div>
			<ActionTooltip side="right" align="center" label="添加事件">
				<div
					onClick={() => onOpen("createEvent")}
					className="group flex items-center cursor-pointer">
					<div>
						<Plus size={15} />
					</div>
				</div>
			</ActionTooltip>
		</div>
	)
}
