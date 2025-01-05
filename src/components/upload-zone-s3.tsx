"use client"

import { cn } from "@/lib/utils"
import axios from "axios"
import { Loader } from "lucide-react"
import { useState } from "react"
import { type FileRejection, useDropzone } from "react-dropzone"

type UploadZoneS3Props = {
	onClientUploadComplete: (url: string) => void
	onUploadError: (error: Error) => void
}

const MAX_FILE_SIZE =
	(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE_MB as unknown as number) *
	1024 *
	1024

export const UploadZoneS3 = ({
	onClientUploadComplete,
	onUploadError,
}: UploadZoneS3Props) => {
	const [uploading, setUploading] = useState(false)
	const [uploadInfo, setUploadInfo] = useState(
		`file size limit: ${MAX_FILE_SIZE / 1024 / 1024} MB`,
	)
	const onDrop = async (
		acceptedFiles: File[],
		fileRejections: FileRejection[],
	) => {
		const failFile = fileRejections[0]
		if (failFile) {
			if (failFile.errors[0].code === "file-too-large") {
				setUploadInfo("File is too large.")
			} else if (failFile.errors[0].code === "file-invalid-type") {
				setUploadInfo("Only jpeg & png")
			} else if (failFile.errors[0].code === "too-many-files") {
				setUploadInfo("Too many files.")
			} else {
				setUploadInfo("Unknown error.")
			}
			return
		}

		const file = acceptedFiles[0]
		setUploading(true)

		const response = await fetch("/api/upload", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ filename: file.name, contentType: file.type }),
		})

		if (response.ok) {
			const { url, fields, key } = await response.json()

			const formData = new FormData()
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.entries(fields).forEach(([key, value]) => {
				formData.append(key, value as string)
			})
			formData.append("file", file)

			const uploadResponse = await axios.post(url, formData)

			setUploading(false)
			if (uploadResponse.status === 204) {
				onClientUploadComplete(`https://images.aganx.com/${key}`)
			} else {
				console.error("S3 Upload Error:", uploadResponse)
				onUploadError(new Error("S3 Upload Error"))
			}
		} else {
			onUploadError(new Error("Failed to get pre-signed URL."))
		}
	}

	const { getRootProps, getInputProps, fileRejections } = useDropzone({
		onDrop,
		multiple: false,
		maxSize: MAX_FILE_SIZE,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			// "image/webp": [],
		},
	})

	return (
		<div
			{...getRootProps()}
			className="w-48 h-48 p-4 flex flex-col gap-4 justify-center items-center border-2 border-dashed border-zinc-400 text-zinc-300 rounded bg-secondary cursor-pointer group hover:bg-primary/10 duration-200 relative">
			<div className="text-lg ">Drop Files Here</div>
			<input {...getInputProps()} />
			<svg
				className="w-8 h-8 mx-auto rotate-45 text-blue-500 group-hover:rotate-[135deg] group-hover:text-lime-500 duration-200"
				fill="currentColor"
				viewBox="7 2 10 20"
				xmlns="http://www.w3.org/2000/svg">
				<title>Upload</title>
				<path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z" />
			</svg>
			<div className="text-xs">
				<span className={cn(fileRejections.length > 0 && "text-red-400")}>
					{uploadInfo}
				</span>
			</div>
			<div className="text-md">click to select</div>
			{uploading && (
				<div className="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-black/90">
					<Loader color="#2F80ED" className="w-8 h-8 animate-spin" />
				</div>
			)}
		</div>
	)
}
