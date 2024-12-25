"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"

export const DeleteEventModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const router = useRouter()

	const isModalOpen = isOpen && type === "deleteEvent"
	const { event } = data

	const [isLoading, setIsLoading] = useState(false)

	const onClick = async () => {
		try {
			setIsLoading(true)

			await axios.delete(`/api/events/${event?.id}`)

			onClose()
			router.refresh()
			router.push("/")
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
						删除事件
					</DialogTitle>
					<DialogDescription className="text-center">
						确认要删除吗？ <br />
						<span className="text-indigo-400 font-semibold">
							{event?.title}
						</span>
						将被永久移除
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button disabled={isLoading} onClick={onClose} variant="secondary">
							取消
						</Button>
						<Button
							disabled={isLoading}
							variant="destructive"
							onClick={onClick}>
							确认
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
