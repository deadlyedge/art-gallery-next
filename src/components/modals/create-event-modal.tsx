"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useModal } from "@/hooks/use-modal-store"
import { useRouter } from "next/navigation"
import { Textarea } from "../ui/textarea"
// import { useOrigin } from "@/hooks/use-origin"

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Must write a title.",
	}),
	description: z.string().optional(),
	imageUrl: z.string().min(1, {
		message: "请上传图片",
	}),
})

export const CreateEventModal = () => {
	const { isOpen, onClose, type } = useModal()
	const router = useRouter()
	// const origin = useOrigin()

	const isModalOpen = isOpen && type === "createEvent"

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			imageUrl: "", //wall-e.with.love.jpg
		},
	})

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post("/api/events", values)

			form.reset()
			onClose()
			router.refresh()
		} catch (error) {
			console.log(error)
		}
	}

	const handleClose = () => {
		form.reset()
		onClose()
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						添加事件
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						事件的名称名称、说明和标题图片。你以后还可以做修改。
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-2 px-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-primary/70">
											Title
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Enter event title"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-primary/70">
											Description
										</FormLabel>
										<FormControl>
											<Textarea
												disabled={isLoading}
												className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="Enter Description"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-primary/70">
												Image
											</FormLabel>
											<FormControl>
												<div className="flex flex-col items-center justify-center">
													<FileUpload
														endpoint="eventImage"
														value={field.value}
														onChange={field.onChange}
													/>
													<Input
														disabled={isLoading}
														className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0 w-80 mt-2"
														placeholder="Or paste image url"
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="px-6 py-2">
							<Button variant="default" disabled={isLoading}>
								创建
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
