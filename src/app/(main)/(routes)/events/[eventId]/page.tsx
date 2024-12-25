import { redirect } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"

import { EventContent } from "@/components/event/event-content"
import { EventHeader } from "@/components/event/event-header"
import { EventMember } from "@/components/event/event-member"
import { EventSection } from "@/components/event/event-section"
import { Suspense } from "react"
import Loading from "./loading"

const EventContentsPage = async (props: {
	params: Promise<{ eventId: string; contentTitle?: string }>
}) => {
	const profile = await currentProfile()
	const { eventId } = await props.params

	if (!profile) {
		return redirect("/")
	}

	const event = await db.event.findUnique({
		where: {
			id: eventId,
		},
		include: {
			contents: {
				orderBy: {
					createdAt: "asc",
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: "asc",
				},
			},
		},
	})

	const members = event?.members.filter(
		(member) => member.profileId !== profile.id,
	)

	if (!event) {
		return redirect("/")
	}

	const role = event.members.find(
		(member) => member.profileId === profile.id,
	)?.role

	// redirect to hashtag after page fully loaded

	return (
		<div className="flex flex-col h-[100vh]">
			<Suspense fallback={<Loading />}>
				<EventHeader event={event} role={role} profileName={profile.name} />
				<div className="flex-1 px-0 md:px-3 pt-10 overflow-y-auto">
					{event?.description && (
						<div className="mb-2">
							<span className="text-xs uppercase font-semibold">
								description:
							</span>{" "}
							<span>{event.description}</span>
						</div>
					)}

					<Separator />

					{!!members?.length && (
						<div className="mb-2">
							<EventSection
								sectionType="members"
								role={role}
								label="Members"
								event={event}
							/>
							<div className="space-y-[2px]">
								{members.map((member) => (
									<EventMember key={member.id} member={member} event={event} />
								))}
							</div>
							<Separator />
						</div>
					)}

					{!!event?.contents.length && (
						<div className="mb-2">
							<EventSection
								sectionType="contents"
								// contentType={ContentType.TEXT}
								role={role}
								label="Contents"
							/>
							<div className="space-y-[2px]">
								{event.contents.map((content) => (
									<div key={content.id}>
										<EventContent
											key={content.id}
											content={content}
											role={role}
											event={event}
										/>
										<Separator key={content.id} />
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</Suspense>
		</div>
	)
}

export default EventContentsPage
