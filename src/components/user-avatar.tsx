import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
	src?: string
	className?: string
}

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
	return (
		<Avatar className={cn("h-7 w-7", className)}>
			<AvatarImage src={src} />
		</Avatar>
	)
}
