"use client"

import { Content, ContentType,  MemberRole, Event } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ActionTooltip } from "@/components/action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store"

type EventContentProps = {
  content: Content
  event: Event
  role?: MemberRole
}

const iconMap = {
  [ContentType.TEXT]: Hash,
  [ContentType.IMAGE]: Mic,
  [ContentType.VIDEO]: Video,
}

export const EventContent = ({
  content,
  event,
  role,
}: EventContentProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[content.type]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/contents/${content.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { content, event })
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.contentId === content.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}>
      <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.contentId === content.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}>
        {content.title}
      </p>
      {content.title !== "general" && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='编辑'>
            <Edit
              onClick={(e) => onAction(e, "editContent")}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
          <ActionTooltip label='删除'>
            <Trash
              onClick={(e) => onAction(e, "deleteContent")}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
      {content.title === "general" && (
        <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  )
}
