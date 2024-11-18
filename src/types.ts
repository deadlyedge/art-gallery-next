import { Server as NetServer, Socket } from "net"
import { NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"
import { Event, Member, Profile } from "@prisma/client"

export type EventWithMembersWithProfiles = Event & {
  members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
