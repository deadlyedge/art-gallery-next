import type { Event, Member, Profile } from "@prisma/client"

export type EventWithMembersWithProfiles = Event & {
	members: (Member & { profile: Profile })[]
}
