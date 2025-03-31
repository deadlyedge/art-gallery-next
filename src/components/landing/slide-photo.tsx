"use client"

import type { Content, Profile } from "@prisma/client"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	// CarouselNext,
	// CarouselPrevious,
} from "../ui/carousel"

type PublicContents = {
	randomContents: (Content & { profile: Profile })[]
} | null

const LandingSlidePhoto = () => {
	const [publicContents, setPublicContents] = useState<PublicContents>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/contents")
				const data = await response.json()
				setPublicContents(data)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}
		fetchData()
	}, [])

	if (!publicContents?.randomContents) {
		return <div>Loading...</div> // Handle the loading state
	}

	const { randomContents: contents } = publicContents

	return (
		<div className="flex items-center justify-center">
			<Carousel
				className=""
				plugins={[
					Autoplay({
						delay: 5000,
					}),
				]}>
				<CarouselContent className="w-[100vw] h-80 sm:w-[600px] sm:h-[320px] md:w-[800px] md:h-[500px] lg:w-[1200px] lg:h-[750px] gap-2">
					{contents.length > 0 ? (
						contents.map(
							(content) =>
								content.imageUrl && (
									<CarouselItem
										key={content.id}
										className="relative h-full overflow-hidden">
										<Image
											src={content.imageUrl}
											alt={content.title}
											fill
											sizes="100vw"
											style={{ objectFit: "cover" }}
										/>
										<div className="absolute z-auto bottom-0 h-40 w-full bg-linear-to-t from-black/70 to-transparent">
											<div className="absolute right-0 bottom-0 mr-8 mb-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-sm">
												<p className="text-lg"># {content.title}</p>
												<p>presented by: {content.profile.name}</p>
											</div>
										</div>
									</CarouselItem>
								),
						)
					) : (
						<CarouselItem className="relative h-full">
							<Image
								src="/landing4.png"
								alt="kaka4"
								fill
								className="object-cover"
							/>
						</CarouselItem>
					)}
				</CarouselContent>
			</Carousel>
		</div>
	)
}

export default LandingSlidePhoto
