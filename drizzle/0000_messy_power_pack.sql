-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."ContentType" AS ENUM('TEXT', 'IMAGE', 'VIDEO');--> statement-breakpoint
CREATE TYPE "public"."MemberRole" AS ENUM('ADMIN', 'MODERATOR', 'GUEST');--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Content" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "ContentType" DEFAULT 'IMAGE' NOT NULL,
	"profileId" text NOT NULL,
	"eventId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"imageUrl" text,
	"title" text NOT NULL,
	"description" text,
	"isPublic" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "Profile" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Member" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "MemberRole" DEFAULT 'GUEST' NOT NULL,
	"profileId" text NOT NULL,
	"eventId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" text PRIMARY KEY NOT NULL,
	"imageUrl" text NOT NULL,
	"inviteCode" text NOT NULL,
	"profileId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"fileUrl" text,
	"memberId" text NOT NULL,
	"contentId" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DirectMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"fileUrl" text,
	"memberId" text NOT NULL,
	"conversationId" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Conversation" (
	"id" text PRIMARY KEY NOT NULL,
	"memberOneId" text NOT NULL,
	"memberTwoId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Content" ADD CONSTRAINT "Content_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Content" ADD CONSTRAINT "Content_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Member" ADD CONSTRAINT "Member_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Member" ADD CONSTRAINT "Member_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."Content"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_memberOneId_fkey" FOREIGN KEY ("memberOneId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_memberTwoId_fkey" FOREIGN KEY ("memberTwoId") REFERENCES "public"."Member"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Content_eventId_idx" ON "Content" USING btree ("eventId" text_ops);--> statement-breakpoint
CREATE INDEX "Content_profileId_idx" ON "Content" USING btree ("profileId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "Member_eventId_idx" ON "Member" USING btree ("eventId" text_ops);--> statement-breakpoint
CREATE INDEX "Member_profileId_idx" ON "Member" USING btree ("profileId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Event_inviteCode_key" ON "Event" USING btree ("inviteCode" text_ops);--> statement-breakpoint
CREATE INDEX "Event_profileId_idx" ON "Event" USING btree ("profileId" text_ops);--> statement-breakpoint
CREATE INDEX "Message_contentId_idx" ON "Message" USING btree ("contentId" text_ops);--> statement-breakpoint
CREATE INDEX "Message_memberId_idx" ON "Message" USING btree ("memberId" text_ops);--> statement-breakpoint
CREATE INDEX "DirectMessage_conversationId_idx" ON "DirectMessage" USING btree ("conversationId" text_ops);--> statement-breakpoint
CREATE INDEX "DirectMessage_memberId_idx" ON "DirectMessage" USING btree ("memberId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Conversation_memberOneId_memberTwoId_key" ON "Conversation" USING btree ("memberOneId" text_ops,"memberTwoId" text_ops);--> statement-breakpoint
CREATE INDEX "Conversation_memberTwoId_idx" ON "Conversation" USING btree ("memberTwoId" text_ops);
*/