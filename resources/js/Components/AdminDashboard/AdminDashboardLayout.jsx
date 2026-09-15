import {
    Sidebar, SidebarContent,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/Components/ui/sidebar"
import {useState} from "react";
import {Link} from "@inertiajs/react";


export default function Layout({ children }) {
    const [openState, setOpenState] = useState(true)
    return (
        <SidebarProvider defaultOpen={true} open={openState} onOpenChange={setOpenState}>
            <Sidebar
                side="left"
                variant="sidebar"
                collapsible="none"
                className={ "h-screen bg-card text-card-foreground border-r"}
            >
                <SidebarHeader>
                    Administrador
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/product">
                                    Productos
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/dashboard/orders">
                                    Pedidos
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main>
                {children}
            </main>
        </SidebarProvider>
    )
}
