import { initialProfile } from "@/lib/initialProfile"
import { SignIn } from "@clerk/nextjs"

export default async function Page() {
  // const profile = await initialProfile()

  return <SignIn />
}
