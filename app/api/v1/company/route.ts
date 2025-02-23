import { prisma } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
        const data = await req.json();
        const company = await prisma.company.create({ data });
        const res = await client.users.updateUserMetadata(session.userId as string, {
            publicMetadata: { role: 'admin', group: company.id },
        })
        return NextResponse.json({ message: 'Perusahaan berhasil dibuat', res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 });
    }
}