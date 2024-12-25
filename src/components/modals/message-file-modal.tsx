"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import qs from "query-string"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "next/navigation"

const formSchema = z.object({
	fileUrl: z.string().min(1, {
		message: "Attachment is required.",
	}),
})

export const MessageFileModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const router = useRouter()

	const isModalOpen = isOpen && type === "messageFile"
	const { apiUrl, query } = data

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fileUrl: "",
		},
	})

	const handleClose = () => {
		form.reset()
		onClose()
	}

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			})

			await axios.post(url, {
				...values,
				text: values.fileUrl,
			})

			form.reset()
			router.refresh()
			handleClose()
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						发送文件消息
					</DialogTitle>
					<DialogDescription className="text-center">
						添加一张图片或一个PDF文件
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="px-6 py-4">
							<Button variant="default" disabled={isLoading}>
								发送
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
