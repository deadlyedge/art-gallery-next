import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.create({
      data: {
        profileId: profile.id,
        title,
        imageUrl,
        inviteCode: uuidv4(),
        contents: {
          create: [
            { title: "general", profileId: profile.id }
          ]
        },
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[EVENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}