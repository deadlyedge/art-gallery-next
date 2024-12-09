"use client"

import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from "@/components/ui/button"

export const LeaveEventModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "leaveEvent"
  const { event } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.patch(`/api/events/${event?.id}/leave`)

      onClose()
      router.refresh()
      router.push("/")
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            离开服务器
          </DialogTitle>
          <DialogDescription className='text-center'>
            确定要离开{" "}
            <span className='font-semibold text-indigo-400'>
              {event?.title}
            </span>{" "}
            吗？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} onClick={onClose} variant='secondary'>
              留下
            </Button>
            <Button disabled={isLoading} variant='destructive' onClick={onClick}>
              离开
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
