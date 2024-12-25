import { redirect } from "next/navigation"

import { InitialModal } from "@/components/modals/initial-modal"
import { db } from "@/lib/db"
import { initialProfile } from "@/lib/initial-profile"

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

	return <InitialModal />
}

export default SetupPage
