import type { Server as NetServer } from "node:http"
import type { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"

import type { NextApiResponseServerIO } from "@/types"

export const config = {
	api: {
		bodyParser: false,
	},
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
	if (!res.socket.server.io) {
		const path = "/api/socket/io"
		const httpServer: NetServer = res.socket.server as any
		const io = new ServerIO(httpServer, {
			path: path,
			// addTrailingSlash: false,
		})
		res.socket.server.io = io
	}

	res.end()
}

export default ioHandler
