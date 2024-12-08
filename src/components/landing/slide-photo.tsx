"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "../ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import { Content, Profile } from "@prisma/client"

type PublicContents = {
  randomContents: (Content & { profile: Profile })[]
} | null

const LandingSlidePhoto = () => {
  const [publicContents, setPublicContents] = useState<PublicContents>(null)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/contents")
      const data = await response.json()
      setPublicContents(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!publicContents?.randomContents) {
    return <div>Loading...</div> // Handle the loading state
  }

  const { randomContents: contents } = publicContents

  return (
    <div className='flex items-center justify-center'>
      <Carousel
        className=''
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}>
        <CarouselContent className='w-[600px] h-[320px] md:w-[800px] md:h-[500px] lg:w-[1200px] lg:h-[750px] gap-2'>
          {contents.length > 0 ? (
            contents.map(
              (content) =>
                content.imageUrl && (
                  <CarouselItem key={content.id} className='relative h-full'>
                    <Image
                      src={content.imageUrl}
                      alt={content.title}
                      fill
                      className='object-cover'
                    />
                    <div className='absolute z-auto bottom-0 h-40 w-full bg-gradient-to-t from-black/70 to-transparent'>
                      <div className='absolute right-0 bottom-0 mr-8 mb-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-sm'>
                        <p className="text-lg"># {content.title}</p>
                        <p>presented by: {content.profile.name}</p>
                      </div>
                    </div>
                  </CarouselItem>
                )
            )
          ) : (
            <CarouselItem className='relative h-full'>
              <Image
                src='/landing4.png'
                alt='kaka4'
                fill
                className='object-cover'
              />
            </CarouselItem>
          )}
          {/* <CarouselItem className='relative h-full'>
            <Image
              src='/landing2.jpg'
              alt='kaka2'
              fill
              className='object-cover'
            />
          </CarouselItem>
          <CarouselItem className='relative h-full'>
            <Image
              src='/landing3.jpg'
              alt='kaka3'
              fill
              className='object-cover'
            />
          </CarouselItem> */}
        </CarouselContent>
        {/* <CarouselPrevious className='bg-white/10' />
        <CarouselNext className='bg-white/10' /> */}
      </Carousel>
    </div>
  )
}

export default LandingSlidePhoto
