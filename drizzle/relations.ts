import { relations } from "drizzle-orm/relations";
import { profile, content, event, member, message, directMessage, conversation } from "./schema";

export const contentRelations = relations(content, ({one, many}) => ({
	profile: one(profile, {
		fields: [content.profileId],
		references: [profile.id]
	}),
	event: one(event, {
		fields: [content.eventId],
		references: [event.id]
	}),
	messages: many(message),
}));

export const profileRelations = relations(profile, ({many}) => ({
	contents: many(content),
	members: many(member),
	events: many(event),
}));

export const eventRelations = relations(event, ({one, many}) => ({
	contents: many(content),
	members: many(member),
	profile: one(profile, {
		fields: [event.profileId],
		references: [profile.id]
	}),
}));

export const memberRelations = relations(member, ({one, many}) => ({
	profile: one(profile, {
		fields: [member.profileId],
		references: [profile.id]
	}),
	event: one(event, {
		fields: [member.eventId],
		references: [event.id]
	}),
	messages: many(message),
	directMessages: many(directMessage),
	conversations_memberOneId: many(conversation, {
		relationName: "conversation_memberOneId_member_id"
	}),
	conversations_memberTwoId: many(conversation, {
		relationName: "conversation_memberTwoId_member_id"
	}),
}));

export const messageRelations = relations(message, ({one}) => ({
	member: one(member, {
		fields: [message.memberId],
		references: [member.id]
	}),
	content: one(content, {
		fields: [message.contentId],
		references: [content.id]
	}),
}));

export const directMessageRelations = relations(directMessage, ({one}) => ({
	member: one(member, {
		fields: [directMessage.memberId],
		references: [member.id]
	}),
	conversation: one(conversation, {
		fields: [directMessage.conversationId],
		references: [conversation.id]
	}),
}));

export const conversationRelations = relations(conversation, ({one, many}) => ({
	directMessages: many(directMessage),
	member_memberOneId: one(member, {
		fields: [conversation.memberOneId],
		references: [member.id],
		relationName: "conversation_memberOneId_member_id"
	}),
	member_memberTwoId: one(member, {
		fields: [conversation.memberTwoId],
		references: [member.id],
		relationName: "conversation_memberTwoId_member_id"
	}),
}));