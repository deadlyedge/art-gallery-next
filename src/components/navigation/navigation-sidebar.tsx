import { redirect } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  // SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
// import Image from "next/image"
import { NavigationItem } from "./navigation-item"
// import SidebarEventMenu from "./sidebar-event-menu"
import LogoMotion from "../logo-motion"
import { NavigationAction } from "./navigation-action"
import { SidebarSearch } from "./sidebar-search"
import { currentUser } from "@clerk/nextjs/server"
import { updateProfile } from "@/lib/update-profile"

export const NavigationSidebar = async () => {
  const profile = await currentProfile()
  const user = await currentUser()

  if (!profile) {
    return redirect("/sign-in")
  }

  if (user?.fullName !== profile.name || user.imageUrl !== profile.imageUrl)
    updateProfile()

  const events = await db.event.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      contents: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  return (
    <Sidebar className='group/logo'>
      <SidebarHeader className='h-10 pt-1.5'>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoMotion size='lg' />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Events</SidebarGroupLabel>
          <SidebarGroupAction>
            <NavigationAction />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {events.map((event) => (
                <SidebarMenuItem key={event.id} className='mb-4'>
                  {/* <div key={event.id} className='mb-4'> */}
                  <NavigationItem
                    id={event.id}
                    title={event.title}
                    imageUrl={event.imageUrl}
                    key={event.id}
                  />
                  {/* <SidebarEventMenu key={event.id} />
                  </div> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className='flex flex-row items-center justify-between'>
          <SidebarMenuItem>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-[32px] w-[32px]",
                },
              }}
            />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarSearch data={events} />
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
