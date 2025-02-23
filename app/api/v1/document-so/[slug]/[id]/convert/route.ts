import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ slug: string, id: string }>

export async function POST(req: NextRequest, segment: {params: Params}) {
    const params = await segment.params
    const user = await currentUser()
    const slug = params.slug
    const id = params.id
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

        if (slug === 'QUOTE') {
            const current = await prisma.documentSO.findUnique({ where: { id, companyId: user?.publicMetadata?.group as string, type: slug as "QUOTE" | "SO" | "INV" } });
            console.log('current', current)
            const customer = await prisma.customer.findUnique(
                {
                    where: {
                        id: current?.customerId as string,
                        customerType: 'CUSTOMER',
                        companyId: user?.publicMetadata?.group as string
                    }
                });
            if (!customer) {
                await prisma.customer.update({ where: { id: current?.customerId as string, customerType: 'LEADS', companyId: user?.publicMetadata?.group as string }, data: { customerType: 'CUSTOMER', source: 'LEADS' } });
            }
        }
        const dataResponse = await prisma.documentSO.update({
            where: {
                id,
                companyId: user?.publicMetadata?.group as string,
                type: slug as "QUOTE" | "SO" | "INV"
            },
            data: {
                type: body.type as "QUOTE" | "SO" | "INV",
                status: body.status,
                converted: true
            }
        });
        return NextResponse.json({ message: 'Convert successfully', data: dataResponse }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}