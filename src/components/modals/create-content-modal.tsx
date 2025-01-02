"use client"

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Bot, ShieldCheck, X } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import qs from "query-string"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"
import { useModal } from "@/hooks/use-modal-store"

const formSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "Content title is required.",
		})
		.refine((title) => title !== "general", {
			message: "Content title cannot be 'general'",
		}),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	isPublic: z.boolean().default(false),
	setEventImage: z.boolean().default(false),
})

export const CreateContentModal = () => {
	const { isOpen, onClose, type, data } = useModal()

	const [hasImage, setHasImage] = useState(false)
	const [isChecked, setIsChecked] = useState(false)
	const [isNSFW, setIsNSFW] = useState(false)
	const router = useRouter()
	const params = useParams()

	const isModalOpen = isOpen && type === "createContent"
	const { imageUrl } = data

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			imageUrl: imageUrl || "",
			isPublic: false,
			setEventImage: false,
		},
	})

	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "imageUrl") {
				setIsChecked(false)
				form.setValue("isPublic", false)
				setHasImage(!!value.imageUrl)
			}
		})
		return () => subscription.unsubscribe()
	}, [form.watch, form.setValue])

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: "/api/contents",
				query: {
					eventId: params?.eventId,
				},
			})
			await axios.post(url, values)

			form.reset()
			router.refresh()
			onClose()
		} catch (error) {
			console.log(error)
		}
	}

	const onAiDescribeClick = async () => {
		const userDescription = form.getValues("description")
		const imageURL = form.getValues("imageUrl")
		const aiDescription = await axios.get(`/api/aiaa?imageURL=${imageURL}`)
		form.setValue(
			"description",
			`${userDescription} and ai said: ${aiDescription.data}`.trim(),
		)
	}

	const onResetAll = () => {
		form.reset()
		setIsChecked(false)
		setIsNSFW(false)
	}

	const onCheckClick = async () => {
		const imageURL = form.getValues("imageUrl")
		if (!imageURL) return
		const url = qs.stringifyUrl({
			url: "/api/safe-search",
			query: {
				imageURL: imageURL,
			},
		})
		const res = await axios.get(url)
		if (res.status === 222) {
			setIsNSFW(true)
			form.setValue("isPublic", false)
		} else {
			setIsNSFW(false)
		}
		setIsChecked(true)
	}

	const handleClose = () => {
		// form.reset()
		onClose()
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 overflow-y-auto max-h-[90vh]">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-base text-center font-bold">
						创建内容
					</DialogTitle>
					<DialogDescription hidden />
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-2 px-6">
							<div className="flex flex-col items-center justify-center text-center">
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
														endpoint="contentImage"
														value={field.value}
														onChange={field.onChange}
													/>
													<Input
														disabled={isLoading}
														className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0 w-80 mt-2"
														placeholder="Or paste image url"
														// onChange={onImageUrlChange}
														{...field}
													/>
													{hasImage && (
														<div className="flex items-center mt-2">
															<p className="text-xs">
																Show it public or use AI, you must do:
															</p>
															<Button
																type="button"
																size="sm"
																onClick={onCheckClick}
																className={cn(
																	"ml-1",
																	!isChecked
																		? "*:text-zinc-500"
																		: isNSFW
																			? "*:text-red-500"
																			: "*:text-green-500",
																)}>
																<ShieldCheck className="w-4 h-4" />
																Safe Check
															</Button>
														</div>
													)}
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
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
												placeholder="Enter content title"
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
											<div className="flex items-center justify-between">
												Description
												{hasImage && (
													<Button
														disabled={isNSFW || !isChecked}
														type="button"
														variant="ghost"
														className="p-1"
														onClick={onAiDescribeClick}>
														<Bot className="w-4 h-4" />
														ai art appreciation
													</Button>
												)}
											</div>
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
						</div>
						<DialogFooter className="px-6 py-4">
							<div className="flex w-full items-center justify-between">
								<Button
									type="button"
									variant="secondary"
									disabled={isLoading}
									onClick={onResetAll}>
									reset
								</Button>
								{hasImage && (
									<div className="flex flex-col items-start justify-start">
										<FormField
											control={form.control}
											name="isPublic"
											render={({ field }) => (
												<FormItem className="rounded-md flex items-center">
													<FormControl>
														{isNSFW ? (
															<X />
														) : (
															<Checkbox
																checked={field.value}
																disabled={!(field.value || isChecked)}
																onCheckedChange={field.onChange}
																className="w-5 h-5 mr-1"
															/>
														)}
													</FormControl>
													<FormLabel className="pb-1.5">
														{isNSFW
															? "此内容无法公开展示"
															: "是否希望此内容和您的名字一起显示在首页"}
													</FormLabel>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="setEventImage"
											render={({ field }) => (
												<FormItem className="rounded-md flex items-center">
													<FormControl>
														<Checkbox
															checked={field.value}
															// disabled={isNSFW || !isChecked}
															onCheckedChange={field.onChange}
															className="w-5 h-5 mr-1"
														/>
													</FormControl>
													<FormLabel className="pb-1.5">
														{isNSFW
															? "此内容无法公开展示"
															: "是否希望此内容设置为事件封面"}
													</FormLabel>
												</FormItem>
											)}
										/>
									</div>
								)}
								<Button variant="default" disabled={isLoading}>
									创建
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
