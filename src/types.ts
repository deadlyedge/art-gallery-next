import type { Event, Member, Profile } from "@prisma/client"
// import type { Server as NetServer, Socket } from "node:net"
// import type { NextApiResponse } from "next"
// import type { Server as SocketIOServer } from "socket.io"

export type EventWithMembersWithProfiles = Event & {
	members: (Member & { profile: Profile })[]
}

// export type NextApiResponseServerIO = NextApiResponse & {
// 	socket: Socket & {
// 		server: NetServer & {
// 			io: SocketIOServer
// 		}
// 	}
// }
