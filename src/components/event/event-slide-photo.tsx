"use client"

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	// CarouselNext,
	// CarouselPrevious,
} from "@/components/ui/carousel"
import type { Content } from "@prisma/client"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useEffect, useState } from "react"

type EventSlidePhotoProps = {
	eventId: string
}

export const EventSlidePhoto = ({ eventId }: EventSlidePhotoProps) => {
	const [showContents, setShowContents] = useState<Content[]>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`/api/events/${eventId}`)
				const data = await response.json()
				console.log(data)
				setShowContents(data.randomContents)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}
		fetchData()
	}, [eventId])

	if (!showContents) {
		return <div>Loading...</div> // Handle the loading state
	}

	return (
		<Carousel
			opts={{
				align: "start",
			}}
			plugins={[
				Autoplay({
					delay: 5000,
				}),
			]}>
			<CarouselContent>
				{showContents.length > 0 &&
					showContents.map(
						(content) =>
							content.imageUrl && (
								<CarouselItem
									key={content.id}
									className="basis-1/2 flex aspect-square items-center justify-center">
									<Image
										src={content.imageUrl}
										alt={content.title}
										width={0}
										height={0}
										sizes="(max-width: 768px) 50vw, 30vw"
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								</CarouselItem>
							),
					)}
			</CarouselContent>
		</Carousel>
	)
}
