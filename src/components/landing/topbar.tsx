import LogoMotion from "../logo-motion"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  // useAuth,
  UserButton,
} from "@clerk/nextjs"
import Link from "next/link"

export const LandingTopbar = ({
  gotoEventClick,
}: {
  gotoEventClick: string
}) => {

  return (
    <nav className='sticky top-0 z-20 bg-black/50 text-xs md:text-base flex items-center justify-between w-full h-12 p-2'>
      <LogoMotion size='lg' />
      <div className='flex items-center'>
        <SignedOut>
          <div className='hover:text-white'>
            <SignInButton mode='modal'>login</SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <Link href={gotoEventClick} className='mr-2 hover:text-white'>
            go to my events
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}
