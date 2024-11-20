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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavigationItem } from "./navigation-item"
import SidebarEventMenu from "./sidebar-event-menu"
import { ModeToggle } from "../mode-toggle"
import LogoMotion from "../logo-motion"
import { NavigationAction } from "./navigation-action"
import { SidebarSearch } from "./sidebar-search"

export const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect("/sign-in")
  }

  const events = await db.event.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <Sidebar>
      <SidebarHeader className="h-10">
        <SidebarMenu>
          <SidebarMenuItem className='group/logo'>
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
                <SidebarMenuItem key={event.id}>
                  <div key={event.id} className='mb-4'>
                    <NavigationItem
                      id={event.id}
                      name={event.name}
                      imageUrl={event.imageUrl}
                    />
                    <SidebarEventMenu key={event.id} />
                  </div>
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
