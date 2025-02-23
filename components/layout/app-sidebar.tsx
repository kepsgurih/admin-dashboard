"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Briefcase,
    Command,
    FileText,
    Frame,
    GalleryVerticalEnd,
    Map,
    Package,
    PieChart,
    Settings2,
    SquareTerminal,
    Users,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/apps",
            icon: SquareTerminal,
            isUrl: '/apps',
            items: [
                {
                    title: "Overview",
                    url: "/apps/",
                },
                {
                    title: "Analytics",
                    url: "/apps/maintenance",
                },
                {
                    title: "Reports",
                    url: "/apps/maintenance",
                },
            ],
        },
        {
            title: "Sales & Order",
            url: "#",
            icon: PieChart,
            isUrl: '/apps/sales-and-order',
            items: [
                {
                    title: "Quotation",
                    url: "/apps/sales-and-order/quotation",
                },
                {
                    title: "Sales Order",
                    url: "/apps/sales-and-order/so",
                },
                {
                    title: "Invoice",
                    url: "/apps/sales-and-order/invoice",
                },
                {
                    title: "Payment",
                    url: "/apps/sales-and-order/payment",
                },
            ],
        },
        {
            title: "Inventory",
            url: "#",
            icon: Package,
            isUrl: '/apps/n1',
            items: [
                {
                    title: "Products",
                    url: "/apps/maintenance",
                },
                {
                    title: "Categories",
                    url: "/apps/maintenance",
                },
                {
                    title: "Stock Management",
                    url: "/apps/maintenance",
                },
                {
                    title: "Suppliers",
                    url: "/apps/maintenance",
                },
            ],
        },
        {
            title: "Procurement",
            url: "#",
            icon: FileText,
            isUrl: '/apps/n2',
            items: [
                {
                    title: "Purchase Order",
                    url: "/apps/maintenance",
                },
                {
                    title: "Vendor Management",
                    url: "/apps/maintenance",
                },
                {
                    title: "Receiving",
                    url: "/apps/maintenance",
                },
                {
                    title: "Bills",
                    url: "/apps/maintenance",
                },
            ],
        },
        {
            title: "HRIS",
            url: "#",
            icon: Briefcase,
            isUrl: '/apps/n3',
            items: [
                {
                    title: "Employees",
                    url: "/apps/maintenance",
                },
                {
                    title: "Attendance",
                    url: "/apps/maintenance",
                },
                {
                    title: "Payroll",
                    url: "/apps/maintenance",
                },
                {
                    title: "Leaves",
                    url: "/apps/maintenance",
                },
                {
                    title: "Recruitment",
                    url: "/apps/maintenance",
                },
            ],
        },
        {
            title: "CRM",
            url: "#",
            icon: Users,
            isUrl: '/apps/crm',
            items: [
                {
                    title: "Leads",
                    url: "/apps/crm/leads",
                },
                {
                    title: "Customers",
                    url: "/apps/crm/customers",
                },
                {
                    title: "Support",
                    url: "/apps/maintenance",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            isUrl: '/apps/n5',
            items: [
                {
                    title: "General",
                    url: "/apps/crm/maintenance",
                },
                {
                    title: "Team",
                    url: "/apps/crm/maintenance",
                },
                {
                    title: "Billing",
                    url: "/apps/crm/maintenance",
                },
                {
                    title: "Limits",
                    url: "/apps/crm/maintenance",
                },
            ],
        },
    ],
    projects: [
        
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
