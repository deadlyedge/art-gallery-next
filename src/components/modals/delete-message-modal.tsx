"use client"

import axios from "axios"
import qs from "query-string"
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

export const DeleteMessageModal = () => {
	const { isOpen, onClose, type, data } = useModal()

	const isModalOpen = isOpen && type === "deleteMessage"
	const { apiUrl, query } = data

	const [isLoading, setIsLoading] = useState(false)

	const onClick = async () => {
		try {
			setIsLoading(true)
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			})

			await axios.delete(url)

			onClose()
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
						删除消息
					</DialogTitle>
					<DialogDescription className="text-center">
						确认删除消息吗？ <br />
						消息将被永久删除。
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
