import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuAction } from "@/components/ui/sidebar"
import { MoreHorizontal } from "lucide-react"

const SidebarEventMenu = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction className="-mt-1 mr-1">
					<MoreHorizontal className="bg-black/50" />
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="right" align="start">
				<DropdownMenuItem>
					<span>Edit Event</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<span>Delete Event</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default SidebarEventMenu
