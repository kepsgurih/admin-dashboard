import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUser()
    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
    }
    const customers = await prisma.payment.findMany({
        where: {
            companyId: user?.publicMetadata?.group as string
        },
        include: {
            DocumentSO: {
                select: {
                    customer: true,
                    customerId: true,
                    type: true,
                    id: true
                },
            }
        }
    });
    return NextResponse.json(customers);
}