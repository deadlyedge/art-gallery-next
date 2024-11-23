"use client"
import { Content, MemberRole, Event } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ActionTooltip } from "@/components/action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store"
import Image from "next/image"
import { ImageSideChat } from "../content/imageSideChat"
import { ScrollArea } from "../ui/scroll-area"

type EventContentProps = {
  content: Content
  event: Event
  role?: MemberRole
}

export const EventContent = ({ content, event, role }: EventContentProps) => {
  const { onOpen } = useModal()
  // const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/events/${event.id}/contents/${content.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { content, event })
  }

  return (
    <div
      // onClick={onClick}
      className='group/content px-0 md:px-2 py-2 rounded-md md:flex items-start justify-start gap-x-2 w-full mb-1'>
      <div className='w-full md:w-1/2'>
        <Image
          src={content.imageUrl || event.imageUrl}
          alt='Content Image'
          width={0}
          height={0}
          sizes='100vw'
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className='w-full md:w-1/2 flex flex-col'>
        <div className='flex items-center p-2 md:p-0'>
          <Hash className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
          <p className='line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition'>
            {content.title}
          </p>
          {content.title !== "general" && role !== MemberRole.GUEST && (
            <div className='ml-auto flex items-center gap-x-2'>
              <ActionTooltip label='编辑'>
                <Edit
                  onClick={(e) => onAction(e, "editContent")}
                  className='hidden group-hover/content:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
                />
              </ActionTooltip>
              <ActionTooltip label='删除'>
                <Trash
                  onClick={(e) => onAction(e, "deleteContent")}
                  className='hidden group-hover/content:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
                />
              </ActionTooltip>
            </div>
          )}
          {content.title === "general" && (
            <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
          )}
        </div>
        <div className='text-xs h-auto'>
            <ImageSideChat eventId={event.id} contentId={content.id} />
        </div>
      </div>
    </div>
  )
}
