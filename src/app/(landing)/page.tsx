import { LandingTopbar } from "@/components/landing/topbar"
import { Bottom } from "@/components/landing/bottom"
import { Contents } from "@/components/contents"
import LandingSlidePhoto from "@/components/landing/slide-photo"
import { LandingHero } from "@/components/landing/hero"
import { LandingContent } from "@/components/landing/content"

export default function Home() {
  return (
    <main className='m-0'>
      <LandingTopbar />
      <LandingSlidePhoto />
      <LandingHero />
      <LandingContent />
      <Bottom />
    </main>
  )
}
