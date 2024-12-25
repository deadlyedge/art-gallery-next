import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function PATCH(
	req: Request,
	props: { params: Promise<{ eventId: string }> },
) {
	const params = await props.params
	try {
		const profile = await currentProfile()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (!params.eventId) {
			return new NextResponse("Event ID Missing", { status: 400 })
		}

		const event = await db.event.update({
			where: {
				id: params.eventId,
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidv4(),
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("[EVENT_ID]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
