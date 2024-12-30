"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Member, MemberRole, type Profile } from "@prisma/client"
import axios from "axios"
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import qs from "query-string"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { ActionTooltip } from "@/components/action-tooltip"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"
import { useModal } from "@/hooks/use-modal-store"
import { cn } from "@/lib/utils"

type ChatItemProps = {
	id: string
	text: string
	member: Member & {
		profile: Profile
	}
	timestamp: string
	fileUrl: string | null
	deleted: boolean
	currentMember: Member
	isUpdated: boolean
	// messageUrl: string
	apiUrl?: string
	messageQuery?: Record<string, string>
	showMode?: boolean
}

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
	ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

const formSchema = z.object({
	text: z.string().min(1),
})

export const ChatItem = ({
	id,
	text,
	member,
	timestamp,
	fileUrl,
	deleted,
	currentMember,
	isUpdated,
	apiUrl,
	// messageUrl,
	messageQuery,
	showMode = false,
}: ChatItemProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const { onOpen } = useModal()
	const params = useParams()
	const router = useRouter()

	const onMemberClick = () => {
		if (member.id === currentMember.id) {
			return
		}

		router.push(`/events/${params?.eventId}/conversations/${member.id}`)
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsEditing(false)
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			text,
		},
	})

	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `${apiUrl}/${id}`,
				query: messageQuery,
			})

			await axios.patch(url, values)

			form.reset()
			setIsEditing(false)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		form.reset({
			text,
		})
	}, [text, form.reset])

	const fileType = fileUrl?.split(".").pop()

	const isAdmin = currentMember.role === MemberRole.ADMIN
	const isModerator = currentMember.role === MemberRole.MODERATOR
	const isOwner = currentMember.id === member.id
	const canDeleteMessage =
		!deleted && (isAdmin || isModerator || isOwner) && !showMode
	const canEditMessage = !deleted && isOwner && !fileUrl && !showMode
	const isPDF = fileType === "pdf" && fileUrl
	const isImage = !isPDF && fileUrl

	return (
		<div className="relative group flex items-center hover:bg-black/10 p-2 my-1 transition w-full">
			<div className="group flex gap-x-2 items-start w-full">
				{!showMode && (
					<div
						onClick={onMemberClick}
						className="cursor-pointer hover:drop-shadow-md transition">
						<UserAvatar src={member.profile.imageUrl} />
					</div>
				)}
				<div className="flex flex-col w-full">
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							{showMode ? (
								<p className="font-semibold text-xs">{member.profile.name}</p>
							) : (
								<p
									onClick={onMemberClick}
									className="font-semibold text-xs hover:underline cursor-pointer">
									{member.profile.name}
								</p>
							)}{" "}
							{!showMode && (
								<ActionTooltip label={member.role}>
									{roleIconMap[member.role]}
								</ActionTooltip>
							)}
						</div>
						<span className="text-[10px] text-zinc-500 dark:text-zinc-400">
							{timestamp}
						</span>
					</div>
					{isImage && (
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="relative rounded-md mt-2 flex items-center justify-center h-48 w-48">
							<Image
								src={fileUrl}
								alt={text}
								width={0}
								height={0}
								sizes="50vw"
								style={{ width: "auto", height: "100%", objectFit: "contain" }}
							/>
						</a>
					)}
					{isPDF && (
						<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
							<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
							<a
								href={fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
								PDF File
							</a>
						</div>
					)}
					{!fileUrl && !isEditing && (
						<p
							className={cn(
								"text-sm text-zinc-600 dark:text-zinc-300",
								deleted &&
									"italic line-through text-zinc-400 dark:text-zinc-500 text-xs mt-1",
							)}>
							{text}
							{isUpdated && !deleted && (
								<span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
									(编辑过)
								</span>
							)}
						</p>
					)}
					{!fileUrl && isEditing && (
						<Form {...form}>
							<form
								className="flex items-center w-full gap-x-2 pt-2"
								onSubmit={form.handleSubmit(onSubmit)}>
								<FormField
									control={form.control}
									name="text"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<div className="relative w-full">
													<Input
														disabled={isLoading}
														className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
														placeholder="Edited message"
														{...field}
													/>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									disabled={isLoading}
									size="sm"
									variant="default">
									Save
								</Button>
							</form>
							<span className="text-[10px] mt-1 text-zinc-400">
								按esc取消，enter确认修改
							</span>
						</Form>
					)}
				</div>
			</div>
			{canDeleteMessage && (
				<div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
					{canEditMessage && (
						<ActionTooltip label="编辑">
							<Edit
								onClick={() => setIsEditing(true)}
								className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
							/>
						</ActionTooltip>
					)}
					<ActionTooltip label="删除">
						<Trash
							onClick={() =>
								onOpen("deleteMessage", {
									apiUrl: `${apiUrl}/${id}`,
									query: messageQuery,
								})
							}
							className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
						/>
					</ActionTooltip>
				</div>
			)}
		</div>
	)
}
