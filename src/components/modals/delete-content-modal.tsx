"use client"

import qs from "query-string"
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

export const DeleteContentModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "deleteContent"
  const { event, content } = data

  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/contents/${content?.id}`,
        query: {
          eventId: event?.id,
        },
      })

      await axios.delete(url)

      onClose()
      router.refresh()
      router.push(`/events/${event?.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            删除频道
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            确定要删除吗？ <br />
            <span className='text-indigo-500 font-semibold'>
              #{content?.title}
            </span>{" "}
            将被永久移除
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} onClick={onClose} variant='ghost'>
              放弃
            </Button>
            <Button disabled={isLoading} variant='default' onClick={onClick}>
              确认
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
