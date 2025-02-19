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
            isActive: true,
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
            items: [
                {
                    title: "Quotation",
                    url: "/apps/quotation",
                },
                {
                    title: "Sales Order",
                    url: "/apps/so",
                },
                {
                    title: "Invoice",
                    url: "/apps/invoice",
                },
                {
                    title: "Payment",
                    url: "/apps/payment",
                },
            ],
        },
        {
            title: "Inventory",
            url: "#",
            icon: Package,
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
            items: [
                {
                    title: "Customers",
                    url: "/apps/maintenance",
                },
                {
                    title: "Leads",
                    url: "/apps/maintenance",
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
            items: [
                {
                    title: "General",
                    url: "/settings/general",
                },
                {
                    title: "Team",
                    url: "/settings/team",
                },
                {
                    title: "Billing",
                    url: "/settings/billing",
                },
                {
                    title: "Limits",
                    url: "/settings/limits",
                },
            ],
        },
    ],
    projects: [
        // {
        //   name: "Design Engineering",
        //   url: "#",
        //   icon: Frame,
        // },
        // {
        //   name: "Sales & Marketing",
        //   url: "#",
        //   icon: PieChart,
        // },
        // {
        //   name: "Travel",
        //   url: "#",
        //   icon: Map,
        // },
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
