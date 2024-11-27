import { LandingTopbar } from "@/components/landing/topbar"
import { Bottom } from "@/components/landing/bottom"
import { Contents } from "@/components/contents"
import LandingSlidePhoto from "@/components/landing/slide-photo"
import { LandingHero } from "@/components/landing/hero"
import { LandingContent } from "@/components/landing/content"
import { initialProfile } from "@/lib/initial-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { InitialModal } from "@/components/modals/initial-modal"

export default async function Home() {
  const { userId } = await auth()

  let gotoEventClick = ""
  if (userId) {
    const profile = await initialProfile()

    const event = await db.event.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    })

    gotoEventClick = event ? `/events/${event.id}` : "/setup"
  }

  return (
    <main className='m-0'>
      <LandingTopbar gotoEventClick={gotoEventClick} />
      <LandingSlidePhoto />
      <LandingHero />
      <LandingContent />
      <Bottom />
    </main>
  )
}
