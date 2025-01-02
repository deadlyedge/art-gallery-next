// import { InitialModal } from "@/components/modals/initial-modal"
import { db } from "@/lib/db"
import { initialProfile } from "@/lib/initial-profile"
import { MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

const SetupPage = async () => {
	const profile = await initialProfile()

	const event = await db.event.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	})

	if (event) {
		return redirect(`/events/${event.id}`)
	}

	const newEvent = await db.event.create({
		data: {
			profileId: profile.id,
			title: "First Event",
			description: "Please edit this event.",
			imageUrl: "/wall-e.with.love.jpg",
			inviteCode: uuidv4(),
			members: {
				create: [
					{
						profileId: profile.id,
						role: MemberRole.ADMIN,
					},
				],
			},
			contents: {
				create: [
					{
						profileId: profile.id,
						title: "general",
						imageUrl: "/wall-e.with.love.jpg",
					},
				],
			},
		},
	})

	return redirect(`/events/${newEvent.id}`)
}

export default SetupPage
