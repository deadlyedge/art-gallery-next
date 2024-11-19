"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const LandingSlidePhoto = () => {
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
          <CarouselItem className='relative h-full'>
            <Image
              src='/landing1.jpg'
              alt='kaka1'
              fill
              className='object-cover'
            />
          </CarouselItem>
          <CarouselItem className='relative h-full'>
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
          </CarouselItem>
          <CarouselItem className='relative h-full'>
            <Image
              src='/landing4.png'
              alt='kaka4'
              fill
              className='object-cover'
            />
          </CarouselItem>
        </CarouselContent>
        {/* <CarouselPrevious className='bg-white/10' />
        <CarouselNext className='bg-white/10' /> */}
      </Carousel>
    </div>
  )
}

export default LandingSlidePhoto
