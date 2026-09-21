import {
    Sidebar, SidebarContent,
    SidebarHeader,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/Components/ui/sidebar"
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils"

const menuItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/product", label: "Productos" },
    { href: "/dashboard/orders", label: "Pedidos" },
]

export default function Layout({ children }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <Sidebar
                side="left"
                variant="sidebar"
                collapsible="none"
                className="border-r border-white/5 bg-sidebar"
            >
                <SidebarHeader className="p-4">
                    <div className="flex items-center gap-2 px-2">
                        <SidebarTrigger className="text-muted-foreground" />
                        <div className="flex items-center gap-1.5">
                            <span className="font-display text-base font-black tracking-[0.14em] text-white">
                                ENTERPRISE
                            </span>
                        </div>
                    </div>
                    <p className="px-2 pt-1 font-display text-[0.65rem] font-semibold tracking-[0.2em] text-clay-teal uppercase">
                        Administración
                    </p>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu className="px-2">
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    className={cn(
                                        "rounded-2xl transition-all",
                                        typeof window !== "undefined" && window.location.pathname === item.href
                                            ? "bg-gradient-to-r from-clay-coral/20 to-clay-violet/20 text-clay-coral shadow-clay-inset"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Link href={item.href}>{item.label}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main className="w-full p-4 md:p-6">{children}</main>
        </SidebarProvider>
    )
}