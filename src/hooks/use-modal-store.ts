import { Content, ContentType, Event } from "@prisma/client"
import { create } from "zustand"

export type ModalType =
  | "createEvent"
  | "invite"
  | "editEvent"
  | "members"
  | "createContent"
  | "leaveEvent"
  | "deleteEvent"
  | "deleteContent"
  | "editContent"
  | "messageFile"
  | "deleteMessage"

type ModalData = {
  event?: Event
  content?: Content
  contentType?: ContentType
  apiUrl?: string
  query?: Record<string, any>
}

type ModalStore = {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))
