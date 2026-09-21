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
    { href: "/admin/dashboard/perms", label: "Permisos" },
]

export default function Layout({ children }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <Sidebar
                side="left"
                variant="sidebar"
                collapsible="none"
                className="sticky top-0 h-screen border-r border-enterprise-border bg-enterprise-bg"
            >
                <SidebarHeader className="p-4">
                    <div className="flex items-center gap-2 px-2">
                        <SidebarTrigger className="text-enterprise-muted" />
                        <div className="flex items-center gap-1.5">
                            <span className="font-display text-base font-black tracking-[0.14em] text-enterprise-text">
                                ENTERPRISE
                            </span>
                        </div>
                    </div>
                    <p className="px-2 pt-1 font-display text-[0.65rem] font-semibold tracking-[0.2em] text-enterprise-primary uppercase">
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
                                            ? "border border-enterprise-primary/30 bg-enterprise-primarySoft text-enterprise-primary"
                                            : "text-enterprise-muted hover:text-enterprise-text"
                                    )}
                                >
                                    <Link href={item.href}>{item.label}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main className="min-h-screen w-full bg-enterprise-bg p-4 md:p-6">{children}</main>
        </SidebarProvider>
    )
}