import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ slug: string, id: string }>
export async function GET(req: NextRequest, segment: { params: Params }) {
    const user = await currentUser()
    const params = await segment.params
    const { slug, id } = params;

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
        const response = await prisma.documentSO.findUnique({
            where: {
                id,
                companyId: user?.publicMetadata?.group as string,
                type: slug as "QUOTE" | "SO" | "INV"
            },
            include: {
                customer: true,
                company: true
            }
        });
        if (!response) {
            return NextResponse.json({ message: "Document not found" }, { status: 404 });
        }
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, segment: { params: Params }) {
    const user = await currentUser()
    const params = await segment.params
    const { slug, id } = params;
    const body = await req.json()

    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
    }
    if (!slug) {
        return NextResponse.json({ message: 'Slug not found' }, { status: 404 });
    }
    if (!id) {
        return NextResponse.json({ message: 'ID not found' }, { status: 404 });
    }

    if (!["QUOTE", "SO", "INV"].includes(slug)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    try {
        const data = {
            ...body,
            companyId: user?.publicMetadata?.group as string,
            type: slug as "QUOTE" | "SO" | "INV"
        }
        const response = await prisma.documentSO.update({
            where: {
                id,
                companyId: user?.publicMetadata?.group as string,
                type: slug as "QUOTE" | "SO" | "INV"
            },
            data
        });
        return NextResponse.json({ message: "Update successfully", data: response });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, segment: { params: Params }) {
    const user = await currentUser()
    const params = await segment.params
    const { slug, id } = params;
    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
    }
    if (!slug) {
        return NextResponse.json({ message: 'Slug not found' }, { status: 404 });
    }
    if (!id) {
        return NextResponse.json({ message: 'ID not found' }, { status: 404 });
    }

    if (!["QUOTE", "SO", "INV"].includes(slug)) {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    try {
        const response = await prisma.documentSO.delete({
            where: {
                id,
                companyId: user?.publicMetadata?.group as string,
                type: slug as "QUOTE" | "SO" | "INV",
                status: "DRAFT"
            }
        });
        return NextResponse.json({ message: "Delete successfully", data: response });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}