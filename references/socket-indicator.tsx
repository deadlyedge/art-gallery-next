"use client"

import { useSocket } from "./socket-provider"
import { Badge } from "@/components/ui/badge"

export const SocketIndicator = () => {
	const { isConnected } = useSocket()

	if (!isConnected) {
		return (
			<Badge variant="outline" className="bg-yellow-600 text-white border-none">
				连接降级: 每秒拉取
			</Badge>
		)
	}

	return (
		<Badge variant="outline" className="bg-emerald-600 text-white border-none">
			Live: 实时消息
		</Badge>
	)
}
