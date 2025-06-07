import { redirect } from "next/navigation"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

type EventIdLayoutProps = {
	children: React.ReactNode
	params: Promise<{ eventId: string }>
}

const EventIdLayout = async ({ children, params }: EventIdLayoutProps) => {
	const profile = await currentProfile()

	if (!profile) {
		return redirect("/sign-in")
	}
	const { eventId } = await params

	const event = await db.event.findUnique({
		where: {
			id: eventId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	})

	if (!event) {
		return redirect("/")
	}

	return <main className="w-full">{children}</main>
}

export default EventIdLayout
