import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Heart, Info, MessageSquareMore } from "lucide-react"
import LogoMotion from "./logo-motion"

type ContentsProps = {}

export const Contents = ({}: ContentsProps) => {
  return (
    <section className='w-full mx-auto flex flex-col items-center justify-center'>
      <LogoMotion size="xl" />
      <h2 className='flex flex-row flex-wrap justify-center py-12 text-2xl'>
        中文测试: 虽然即将发售的《逆转检察官1&2
      </h2>
      <div className='container sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4 mb-2 break-inside-avoid-column'>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/FE8RRKXh'
            alt='https://file.zick.me/s/FE8RRKXh'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <MessageSquareMore className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/PgphsE2M'
            alt='https://file.zick.me/s/PgphsE2M'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <Info className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/FE8RRKXh'
            alt='https://file.zick.me/s/FE8RRKXh'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <MessageSquareMore className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/hbw6fArF'
            alt='https://file.zick.me/s/hbw6fArF'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <MessageSquareMore className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/PgphsE2M'
            alt='https://file.zick.me/s/PgphsE2M'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <MessageSquareMore className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
        <div className='mb-4 w-full relative'>
          <Image
            src='https://file.zick.me/s/hbw6fArF'
            alt='https://file.zick.me/s/hbw6fArF'
            width={720}
            height={720}
            className='object-contain'
          />
          <div className='absolute top-0 w-full h-8 bg-slate-600/20 flex items-center px-2'>
            <span className='text-sm'>
              <MessageSquareMore className='w-6 h-6 inline' /> 23
            </span>
            <span className='absolute right-2 text-sm'>
              15 <Heart className='w-6 h-6 inline' />
            </span>
          </div>
          <div className='absolute bottom-0 w-full h-12 bg-slate-800/80 flex items-center px-2'>
            <p>老陆自画像</p>
          </div>
        </div>
      </div>
    </section>
  )
}
