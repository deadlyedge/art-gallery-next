"use client"

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

type ActionTooltipProps = {
	label: string
	children: React.ReactNode
	side?: "top" | "right" | "bottom" | "left"
	align?: "start" | "center" | "end"
}

export const ActionTooltip = ({
	label,
	children,
	side,
	align,
}: ActionTooltipProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					align={align}
					className="text-primary bg-primary-foreground">
					<p className="font-semibold text-sm capitalize">
						{label.toLowerCase()}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
