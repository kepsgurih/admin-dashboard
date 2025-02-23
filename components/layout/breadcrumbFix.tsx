'use client'

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react";

function capitalizeFirstLetter(str: string) {
    str = str.replace(/-/g, ' ');
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(' ');
}

export default function BreadcrumbFix() {
    const pathname = usePathname()
    const pathArray = pathname.split("/").filter(Boolean);
    function getPath(value: string) {
        const index = pathArray.indexOf(value);
        if (index === -1) return null; // Jika value tidak ditemukan
        return "/" + pathArray.slice(0, index + 1).join("/");
    }
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    pathArray.map((item, index) => {
                        const last = index + 1
                        if (last === pathArray.length) {
                            return (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage>{capitalizeFirstLetter(item)}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )
                        }
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href={getPath(item) || "/"}>{capitalizeFirstLetter(item)}</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                            </React.Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}