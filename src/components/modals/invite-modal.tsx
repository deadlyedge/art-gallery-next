"use client"

import axios from "axios"
import { Check, Copy, RefreshCw } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModal } from "@/hooks/use-modal-store"
import { useOrigin } from "@/hooks/use-origin"

export const InviteModal = () => {
	const { onOpen, isOpen, onClose, type, data } = useModal()
	const origin = useOrigin()

	const isModalOpen = isOpen && type === "invite"
	const { event } = data

	const [copied, setCopied] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const inviteUrl = `${origin}/invite/${event?.inviteCode}`

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl)
		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 1000)
	}

	const onNew = async () => {
		try {
			setIsLoading(true)
			const response = await axios.patch(`/api/events/${event?.id}/invite-code`)

			onOpen("invite", { event: response.data })
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						邀请朋友
					</DialogTitle>
					<DialogDescription className="pt-4 text-center">
						任何人都可以使用此链接加入服务器
					</DialogDescription>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold">邀请链接</Label>
					<div onClick={onCopy} className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0"
							value={inviteUrl}
							readOnly
						/>
						<Button disabled={isLoading} size="icon">
							{copied ? (
								<Check className="w-4 h-4 text-green-500" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>
					<Button
						onClick={onNew}
						disabled={isLoading}
						variant="link"
						size="sm"
						className="text-xs mt-4">
						生成新链接
						<RefreshCw className="w-4 h-4 ml-2" />
						<div className="ml-2 text-xs">生成新链接后，旧链接将失效</div>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
