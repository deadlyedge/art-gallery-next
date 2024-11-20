import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>

      <SidebarProvider >
        <NavigationSidebar />
        <main>
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
      {/* <main className='md:pl-[72px] h-full'>{children}</main> */}
    </div>
  )
}

export default MainLayout
