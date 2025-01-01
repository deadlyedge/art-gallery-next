import { redirect } from "next/navigation"
import {
	SignInButton,
	SignedOut,
} from "@clerk/nextjs"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LogoMotion from "@/components/logo-motion"

const InviteCodePage = async (props: {
	params: Promise<{ inviteCode: string }>
}) => {
	const profile = await currentProfile()
	const { inviteCode } = await props.params

	if (!inviteCode) {
		return redirect("/")
	}

	if (profile) {
		const existingEvent = await db.event.findFirst({
			where: {
				inviteCode,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
		})

		if (existingEvent) {
			return redirect(`/events/${existingEvent.id}`)
		}

		const event = await db.event.update({
			where: {
				inviteCode,
			},
			data: {
				members: {
					create: [
						{
							profileId: profile.id,
						},
					],
				},
			},
		})

		if (event) {
			return redirect(`/events/${event.id}`)
		}
	}

	const targetEvent = await db.event.findFirst({
		where: {
			inviteCode,
		},
	})

	return (
		<div className="w-full h-80 flex flex-col items-center justify-center">
			<Card className="w-[30rem]">
				<CardContent className="p-0 overflow-hidden">
					<CardHeader className="pt-8 px-6">
						<CardTitle className="flex items-center justify-center font-normal">
							<LogoMotion size="xl" />
						</CardTitle>
						<CardDescription className="text-center">
							您必须先登录才能加入事件{" "}
							<span className="font-semibold text-indigo-400">
								#{targetEvent?.title}
							</span>
							{" 。"}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6 flex items-center justify-center">
						<SignedOut>
							<div className="hover:text-white">
								<SignInButton
									mode="modal"
									fallbackRedirectUrl={`/invite/${inviteCode}`}>
									<Button>SignIn</Button>
								</SignInButton>
							</div>
						</SignedOut>
						{/* <SignedIn>
							<Link
								href={`/invite/${inviteCode}`}
								className="mr-2 hover:text-white">
								go to #{targetEvent?.title}
							</Link>
							<UserButton />
						</SignedIn> */}
					</CardContent>
				</CardContent>
			</Card>
		</div>
	)
}

export default InviteCodePage
