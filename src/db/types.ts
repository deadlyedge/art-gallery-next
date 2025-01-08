import type { ColumnType, Insertable, Selectable, Updateable } from "kysely"
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export const MemberRole = {
	ADMIN: "ADMIN",
	MODERATOR: "MODERATOR",
	GUEST: "GUEST",
} as const
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole]
export const ContentType = {
	TEXT: "TEXT",
	IMAGE: "IMAGE",
	VIDEO: "VIDEO",
} as const
export type ContentType = (typeof ContentType)[keyof typeof ContentType]
export type Content = {
	id: string
	type: Generated<ContentType>
	title: string
	imageUrl: string | null
	description: string | null
	isPublic: Generated<boolean | null>
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
	eventId: string
	profileId: string
}
export type Conversation = {
	id: string
	memberOneId: string
	memberTwoId: string
}
export type DirectMessage = {
	id: string
	text: string
	fileUrl: string | null
	deleted: Generated<boolean>
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
	conversationId: string
	memberId: string
}
export type Event = {
	id: string
	title: string
	description: string | null
	imageUrl: string
	inviteCode: string
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
	profileId: string
}
export type Member = {
	id: string
	role: Generated<MemberRole>
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
	eventId: string
	profileId: string
}
export type Message = {
	id: string
	text: string
	fileUrl: string | null
	deleted: Generated<boolean>
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
	contentId: string
	memberId: string
}
export type Profile = {
	id: string
	userId: string
	name: string
	imageUrl: string
	email: string
	createdAt: Generated<Timestamp>
	updatedAt: Timestamp
}
export type Database = {
	Content: Content
	Conversation: Conversation
	DirectMessage: DirectMessage
	Event: Event
	Member: Member
	Message: Message
	Profile: Profile
}
export type ReadProfile = Selectable<Profile>
export type ReadContent = Selectable<Content>
export type ReadEvent = Selectable<Event>
export type ReadMember = Selectable<Member>
export type ReadMessage = Selectable<Message>
export type ReadDirectMessage = Selectable<DirectMessage>
export type ReadConversation = Selectable<Conversation>

export type CreateProfile = Insertable<Profile>
export type CreateContent = Insertable<Content>
export type CreateEvent = Insertable<Event>
export type CreateMember = Insertable<Member>
export type CreateMessage = Insertable<Message>
export type CreateDirectMessage = Insertable<DirectMessage>
export type CreateConversation = Insertable<Conversation>

export type UpdateProfile = Updateable<Profile>
export type UpdateContent = Updateable<Content>
export type UpdateEvent = Updateable<Event>
export type UpdateMember = Updateable<Member>
export type UpdateMessage = Updateable<Message>
