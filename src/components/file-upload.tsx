"use client"

import { FileIcon, X } from "lucide-react"
import Image from "next/image"

import { UploadZoneS3 } from "./upload-zone-s3"

type FileUploadProps = {
	onChange: (url?: string) => void
	value: string
	endpoint: "contentImage" | "eventImage" | "profileImage" | "messageFile"
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
	const fileType = value?.split(".").pop()

	if (value && fileType !== "pdf") {
		return (
			<div className="relative h-40">
				<Image
					src={value}
					alt="Upload"
					width={0}
					height={0}
					style={{ width: "auto", height: "100%" }}
					sizes="(max-width: 768px) 80vw, 20vw"
				/>
				<button
					onClick={() => onChange("")}
					className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-xs"
					type="button">
					<X className="h-4 w-4" />
				</button>
			</div>
		)
	}

	if (value && fileType === "pdf") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
					{value}
				</a>
				<button
					onClick={() => onChange("")}
					className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-xs"
					type="button">
					<X className="h-4 w-4" />
				</button>
			</div>
		)
	}

	return (
		// <UploadDropzone
		// 	endpoint={endpoint}
		// 	onClientUploadComplete={(res) => {
		// 		onChange(res?.[0].url)
		// 	}}
		// 	onUploadError={(error: Error) => {
		// 		console.log(error)
		// 	}}
		// 	className="border-dashed border-2 dark:border-primary/50 text-primary rounded-lg p-4 text-center hover:bg-primary-foreground/80"
		// />
		<UploadZoneS3
			onClientUploadComplete={(res) => onChange(res)}
			onUploadError={(error: Error) => console.log(error)}
		/>
	)
}
