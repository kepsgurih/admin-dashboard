import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const client = await clerkClient()
    const session = await auth()
    const group = session.sessionClaims?.metadata?.group
    if (!session.userId) {
        return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
    }
    if (group) {
        return NextResponse.json({ message: 'Anda sudah tergabung dengan perusahaan' }, { status: 433 });
    }
    try {
        const searchEmail = await prisma.company.findUnique({ where: { email: data.email } })
        const searchPhone = await prisma.company.findUnique({ where: { phone: data.phone } })
        if (searchEmail) return NextResponse.json({ message: 'Email Already exist' }, { status: 433 });
        if (searchPhone) return NextResponse.json({ message: 'Phone Already exist' }, { status: 433 });
        const company = await prisma.company.create({ data });
        await client.users.updateUserMetadata(session.userId as string, {
            publicMetadata: {
                role: 'admin',
                group: company.id
            },
        })
        return NextResponse.json({ message: 'Company successfully created' }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
    }
}