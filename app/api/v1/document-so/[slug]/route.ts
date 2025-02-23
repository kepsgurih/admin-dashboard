import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ slug: string }>
export async function GET(req: NextRequest, segment: { params: Params }) {
    const user = await currentUser()
    const params = await segment.params
    const slug = params.slug

    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
    }
    if (!slug) {
        return NextResponse.json({ message: 'Slug not found' }, { status: 404 });
    }

    if (!["QUOTE", "SO", "INV"].includes(slug)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    try {
        const response = await prisma.documentSO.findMany({
            where: {
                companyId: user?.publicMetadata?.group as string,
                type: slug as "QUOTE" | "SO" | "INV"
            },
            include: {
                customer: true
            }
        });
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}

export async function POST(req: NextRequest, segment: { params: Params }) {
    const user = await currentUser()
    const params = await segment.params
    const slug = params.slug
    const body = await req.json()
    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
    }
    if (!slug) {
        return NextResponse.json({ message: 'Slug not found' }, { status: 404 });
    }

    if (!["QUOTE", "SO", "INV"].includes(slug)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    try {
        const data = {
            ...body,
            companyId: user?.publicMetadata?.group as string,
            type: slug as "QUOTE" | "SO" | "INV",
            status: "DRAFT"
        }
        const response = await prisma.documentSO.create({ data });
        return NextResponse.json({ message: 'Success create document', data: response });
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}