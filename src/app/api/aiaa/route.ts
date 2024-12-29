import { currentProfile } from "@/lib/current-profile"
import { type NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) =>{
  const profile = await currentProfile()
  if(!profile){
    return NextResponse.json("Unauthorized", {status: 401})
  }
  const searchParams = req.nextUrl.searchParams
  const imageURL = searchParams.get('imageURL')
}