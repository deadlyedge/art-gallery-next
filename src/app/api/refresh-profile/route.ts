import { updateProfile } from "@/lib/update-profile"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // const { searchParams } = new URL(req.url)
    updateProfile()
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.log("[MESSAGES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
