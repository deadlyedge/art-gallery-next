"use client"

import { EventWithMembersWithProfiles } from "@/types"
import { MemberRole } from "@prisma/client"
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModal } from "@/hooks/use-modal-store"

type EventHeaderProps = {
  event: EventWithMembersWithProfiles
  role?: MemberRole
}

export const EventHeader = ({ event, role }: EventHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='text-base font-semibold px-3 flex items-center h-10 text-foreground border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 hover:dark:text-white dark:hover:bg-zinc-700/50 transition gap-2'>
          {event.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { event })}
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>
            邀请朋友
            <UserPlus className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editEvent", { event })}
            className='px-3 py-2 text-sm cursor-pointer'>
            服务器设置
            <Settings className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { event })}
            className='px-3 py-2 text-sm cursor-pointer'>
            管理成员
            <Users className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createContent")}
            className='px-3 py-2 text-sm cursor-pointer'>
            创建频道
            <PlusCircle className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteEvent", { event })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            删除服务器
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveEvent", { event })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
            离开服务器
            <LogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
