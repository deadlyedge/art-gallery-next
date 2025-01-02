import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { SignInButton, SignedOut } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import LogoMotion from "@/components/logo-motion"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

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
		<div className="w-full h-80 flex flex-row items-center justify-center">
			<Card>
				<CardContent className="p-0 overflow-hidden">
					<CardHeader className="pt-8 px-6">
						<CardTitle className="flex items-center justify-center font-normal gap-x-3">
							欢迎来到
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
					<CardFooter className="px-6 flex items-center justify-center">
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
					</CardFooter>
				</CardContent>
			</Card>
		</div>
	)
}

export default InviteCodePage
