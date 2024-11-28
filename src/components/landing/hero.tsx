import Link from "next/link"

import { Button } from "@/components/ui/button"
import LogoMotion from "../logo-motion"

export function LandingHero({
  gotoEventClick,
}: {
  gotoEventClick: string
}) {
  return (
    <div className='flex flex-col items-center justify-center text-white py-16 text-center space-y-5'>
      <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-bold'>
        art gallery next
      </h1>
      <p className='text-lg text-foreground'>in short:</p>
      <div className='ml-2'>
        <LogoMotion size='xl' />
      </div>
      <div className='text-sm md:text-xl mt-12 text-foreground'>
        100% free. No-fee. No ads. No watermark.
      </div>
      <div>
        <Link href={gotoEventClick}>
          <Button className='md:text-lg p-4 md:p-6 rounded-full font-semibold w-fit'>
            Start NOW!
          </Button>
        </Link>
      </div>
      <div className='text-foreground text-xs md:text-sm font-normal'>
        use vercel or vps and docker to serve.
      </div>
    </div>
  )
}
