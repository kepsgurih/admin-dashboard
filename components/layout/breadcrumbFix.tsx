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

function capitalizeFirstLetter(str:string) {
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
                                    <BreadcrumbLink href="/apps">{capitalizeFirstLetter(item)}</BreadcrumbLink>
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