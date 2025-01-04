"use client"

import axios from "axios"
import { Loader } from "lucide-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"

type UploadZoneS3Props = {
	onClientUploadComplete: (url: string) => void
	onUploadError: (error: Error) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const UploadZoneS3 = ({
	onClientUploadComplete,
	onUploadError,
}: UploadZoneS3Props) => {
	const [uploading, setUploading] = useState(false)

	const onDrop = async (acceptedFiles: File[]) => {
		setUploading(true)

		const file = acceptedFiles[0]

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

			if (uploadResponse.status === 204) {
				onClientUploadComplete(`${url}${key}`)
			} else {
				console.error("S3 Upload Error:", uploadResponse)
				onUploadError(new Error("S3 Upload Error"))
			}
		} else {
			onUploadError(new Error("Failed to get pre-signed URL."))
		}

		setUploading(false)
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		maxSize: MAX_FILE_SIZE,
		accept: {
			"image/*": [".jpeg", ".png", ".jpg"],
		},
	})

	return (
		<div
			{...getRootProps()}
			className="w-48 h-48 p-4 flex flex-col gap-4 justify-center items-center border-2 border-dashed border-zinc-400 text-zinc-300 rounded bg-secondary cursor-pointer group hover:bg-primary/10 duration-200 uppercase relative">
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
				file size limit: {MAX_FILE_SIZE / 1024 / 1024} MB
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
