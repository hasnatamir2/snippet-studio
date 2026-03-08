import { LayoutDashboard, CreditCard, PlusSquare, Home } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "New Snippet",
        url: "/new",
        icon: PlusSquare,
    },
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
    },
];

export function AppSidebar() {
    return (
        <Sidebar variant='floating'>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Snippet Studio</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
