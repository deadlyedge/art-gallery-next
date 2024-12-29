"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import { ContentType } from "@prisma/client"

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	// DialogDescription,
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
import { Bot } from "lucide-react"

const formSchema = z.object({
	title: z
		.string()
		.min(1, {
			message: "Content title is required.",
		})
		.refine((title) => title !== "general", {
			message: "Content title cannot be 'general'",
		}),
	// type: z.nativeEnum(ContentType),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
	isPublic: z.boolean().default(false),
})

export const EditContentModal = () => {
	const { isOpen, onClose, type, data } = useModal()
	const router = useRouter()

	const isModalOpen = isOpen && type === "editContent"
	const { content, event } = data

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: content?.title || "",
			description: content?.description || "",
			imageUrl: content?.imageUrl || "",
			isPublic: content?.isPublic || false,
		},
	})

	useEffect(() => {
		if (content) {
			form.setValue("title", content.title)
			form.setValue("description", content.description || "")
			form.setValue("imageUrl", content.imageUrl || "")
			form.setValue(
				"isPublic",
				(!!content.imageUrl && content.isPublic) || false,
			)
		}
		// axios.post("/api/aiaa", { imageURL: content?.imageUrl })
	}, [form, content, content?.imageUrl])

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `/api/contents/${content?.id}`,
				query: {
					eventId: event?.id,
				},
			})
			await axios.patch(url, values)

			form.reset()
			router.refresh()
			onClose()
		} catch (error) {
			console.log(error)
		}
	}

	const noImageURL = !form.getValues("imageUrl")

	const onAiDescribeClick = async () => {
		const userDescription = form.getValues("description")
		const imageURL = form.getValues("imageUrl")
		const aiDescription = await axios.get(`/api/aiaa?imageURL=${imageURL}`)
		form.setValue(
			"description",
			`${userDescription} and ai said: ${aiDescription.data}`,
		)
	}

	const handleClose = () => {
		// form.reset()
		onClose()
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						编辑内容
					</DialogTitle>
					{/* <DialogDescription className='text-center text-zinc-500'>
            目前只能选择文字类型的频道
          </DialogDescription> */}
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-primary/70">
											title
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className="border border-zinc-500 focus:bg-zinc-900/80 focus-visible:ring-0 focus-visible:ring-offset-0"
												placeholder="输入内容标题"
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
											<div className="flex items-center">
												Description
												<Button
													disabled={noImageURL}
													type="button"
													variant="ghost"
													className="p-1"
													onClick={onAiDescribeClick}>
													<Bot className="w-4 h-4" />
												</Button>
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
							<div className="flex flex-col items-center justify-center text-center">
								<FormField
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-primary/70">
												Image
											</FormLabel>
											<FormControl className="flex items-center justify-center">
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
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="px-6 py-4">
							<FormField
								control={form.control}
								name="isPublic"
								render={({ field }) => (
									<FormItem className="rounded-md flex items-center">
										<FormControl>
											<Checkbox
												checked={field.value}
												disabled={noImageURL}
												onCheckedChange={field.onChange}
												className="w-5 h-5 mr-1"
											/>
										</FormControl>
										<FormLabel className="pb-1.5">
											是否希望此内容和您的名字一起显示在首页
										</FormLabel>
										{/* <FormDescription>
                        You can manage your mobile notifications in the{" "}
                        <Link href='/examples/forms'>mobile settings</Link>{" "}
                        page.
                      </FormDescription> */}
									</FormItem>
								)}
							/>
							<Button variant="default" disabled={isLoading}>
								保存
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
