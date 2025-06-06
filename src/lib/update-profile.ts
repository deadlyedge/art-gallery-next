import { currentUser } from "@clerk/nextjs/server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const updateProfile = async () => {
	const user = await currentUser()

	if (!user) {
		return redirect("/sign-in")
	}

	const newProfile = await db.profile.update({
		where: { userId: user.id },
		data: {
			// userId: user.id,
			name: `${user.firstName} ${user.lastName}`,
			imageUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
		},
	})

	return newProfile
}
