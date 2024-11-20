"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ActionTooltip } from "@/components/action-tooltip"

type NavigationItemProps = {
  id: string
  imageUrl: string
  name: string
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/events/${id}`)
  }

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button onClick={onClick} className='group/tooltip relative flex items-center'>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.eventId !== id && "group-hover/tooltip:h-[20px]",
            params?.eventId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group/tooltip flex mx-3 h-[120px] w-[245px] group-hover/tooltip:rounded-[16px] transition-all overflow-hidden",
            params?.eventId === id &&
              "bg-primary/10 text-primary"
          )}>
          <Image
            fill
            src={imageUrl}
            alt='Content'
            sizes='(max-width: 500px) 30vw, (max-width: 800px) 40vw, 50vw'
            className='object-cover'
          />
          <div className="absolute w-full h-[120px] mx-auto mt-12 text-xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{name}</div>
        </div>
      </button>
    </ActionTooltip>
  )
}
