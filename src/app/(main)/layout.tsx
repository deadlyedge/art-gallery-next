import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<NavigationSidebar />
			<div className="w-full">
				<SidebarTrigger className="fixed z-50 mt-2 ml-1 md:hidden" />
				{children}
			</div>
		</SidebarProvider>
	)
}

export default MainLayout
