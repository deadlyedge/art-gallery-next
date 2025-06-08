import { pgTable, varchar, timestamp, text, integer, index, foreignKey, boolean, uniqueIndex, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const contentType = pgEnum("ContentType", ['TEXT', 'IMAGE', 'VIDEO'])
export const memberRole = pgEnum("MemberRole", ['ADMIN', 'MODERATOR', 'GUEST'])


export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const content = pgTable("Content", {
	id: text().primaryKey().notNull(),
	type: contentType().default('IMAGE').notNull(),
	profileId: text().notNull(),
	eventId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	imageUrl: text(),
	title: text().notNull(),
	description: text(),
	isPublic: boolean().default(false),
}, (table) => [
	index("Content_eventId_idx").using("btree", table.eventId.asc().nullsLast().op("text_ops")),
	index("Content_profileId_idx").using("btree", table.profileId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profile.id],
			name: "Content_profileId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "Content_eventId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const profile = pgTable("Profile", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	name: text().notNull(),
	imageUrl: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Profile_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("Profile_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const member = pgTable("Member", {
	id: text().primaryKey().notNull(),
	role: memberRole().default('GUEST').notNull(),
	profileId: text().notNull(),
	eventId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("Member_eventId_idx").using("btree", table.eventId.asc().nullsLast().op("text_ops")),
	index("Member_profileId_idx").using("btree", table.profileId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profile.id],
			name: "Member_profileId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "Member_eventId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const event = pgTable("Event", {
	id: text().primaryKey().notNull(),
	imageUrl: text().notNull(),
	inviteCode: text().notNull(),
	profileId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	title: text().notNull(),
	description: text(),
}, (table) => [
	uniqueIndex("Event_inviteCode_key").using("btree", table.inviteCode.asc().nullsLast().op("text_ops")),
	index("Event_profileId_idx").using("btree", table.profileId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.profileId],
			foreignColumns: [profile.id],
			name: "Event_profileId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const message = pgTable("Message", {
	id: text().primaryKey().notNull(),
	text: text().notNull(),
	fileUrl: text(),
	memberId: text().notNull(),
	contentId: text().notNull(),
	deleted: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("Message_contentId_idx").using("btree", table.contentId.asc().nullsLast().op("text_ops")),
	index("Message_memberId_idx").using("btree", table.memberId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [member.id],
			name: "Message_memberId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.contentId],
			foreignColumns: [content.id],
			name: "Message_contentId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const directMessage = pgTable("DirectMessage", {
	id: text().primaryKey().notNull(),
	fileUrl: text(),
	memberId: text().notNull(),
	conversationId: text().notNull(),
	deleted: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	text: text().notNull(),
}, (table) => [
	index("DirectMessage_conversationId_idx").using("btree", table.conversationId.asc().nullsLast().op("text_ops")),
	index("DirectMessage_memberId_idx").using("btree", table.memberId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [member.id],
			name: "DirectMessage_memberId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversation.id],
			name: "DirectMessage_conversationId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const conversation = pgTable("Conversation", {
	id: text().primaryKey().notNull(),
	memberOneId: text().notNull(),
	memberTwoId: text().notNull(),
}, (table) => [
	uniqueIndex("Conversation_memberOneId_memberTwoId_key").using("btree", table.memberOneId.asc().nullsLast().op("text_ops"), table.memberTwoId.asc().nullsLast().op("text_ops")),
	index("Conversation_memberTwoId_idx").using("btree", table.memberTwoId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.memberOneId],
			foreignColumns: [member.id],
			name: "Conversation_memberOneId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.memberTwoId],
			foreignColumns: [member.id],
			name: "Conversation_memberTwoId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
