import { Bottom } from "@/components/landing/bottom"
import { LandingContent } from "@/components/landing/content"
import { LandingHero } from "@/components/landing/hero"
import LandingSlidePhoto from "@/components/landing/slide-photo"
import { LandingTopbar } from "@/components/landing/topbar"
import { db } from "@/lib/db"
import { initialProfile } from "@/lib/initial-profile"
// import { InitialModal } from "@/components/modals/initial-modal"
import { updateProfile } from "@/lib/update-profile"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
	const { userId } = await auth()

	let gotoEventClick = "/setup"
	if (userId) {
		const profile = await initialProfile()
		const user = await currentUser()

		// if (!profile) {
		// 	return redirect("/")
		// }

		if (user?.fullName !== profile.name || user.imageUrl !== profile.imageUrl)
			updateProfile()

		const event = await db.event.findFirst({
			where: {
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
		})

		gotoEventClick = event ? `/events/${event.id}` : "/setup"
	}

	return (
		<main className="h-[100vh] z-50 flex flex-col gap-8 row-start-2 items-center justify-center backdrop-blur">
			<LandingTopbar gotoEventClick={gotoEventClick} />
			<div className="overflow-y-auto pt-12">
				<LandingSlidePhoto />
				<LandingHero gotoEventClick={gotoEventClick} />
				<LandingContent />
				<Bottom />
			</div>
		</main>
	)
}
