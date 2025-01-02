import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

export async function DELETE(
	req: Request,
	props: { params: Promise<{ eventId: string }> },
) {
	const params = await props.params
	try {
		const profile = await currentProfile()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const event = await db.event.delete({
			where: {
				id: params.eventId,
				profileId: profile.id,
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("[EVENT_ID_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	props: { params: Promise<{ eventId: string }> },
) {
	const params = await props.params
	try {
		const profile = await currentProfile()
		const { title, description, imageUrl } = await req.json()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		if (title && description && imageUrl) {
			const event = await db.event.update({
				where: {
					id: params.eventId,
					profileId: profile.id,
				},
				data: {
					title,
					description,
					imageUrl,
				},
			})
			return NextResponse.json(event)
		}

		const event = await db.event.update({
			where: {
				id: params.eventId,
				profileId: profile.id,
			},
			data: {
				imageUrl,
			},
		})

		return NextResponse.json(event)
	} catch (error) {
		console.log("[EVENT_ID_PATCH]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

const TOTAL_GENERAL_CONTENT_SHOWS = 10

export async function GET(
	req: Request,
	props: { params: Promise<{ eventId: string }> },
) {
	const params = await props.params
	try {
		const profile = await currentProfile()

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const contents = await db.content.findMany({
			where: {
				eventId: params.eventId,
			},
		})
		function getRandomElements<T>(arr: Array<T>, count: number): Array<T> {
			return arr.sort(() => Math.random() - 0.5).slice(0, count)
		}

		const randomContents = getRandomElements(
			contents,
			TOTAL_GENERAL_CONTENT_SHOWS,
		)

		return NextResponse.json({
			randomContents,
		})
	} catch (error) {
		console.log("[CONTENTS_GET]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}
