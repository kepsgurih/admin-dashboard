import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    try {
        const salesOrder = await prisma.salesOrder.findUnique({
            where: { id },
            include: {
                customer: true
            }
        });

        if (!salesOrder) {
            return NextResponse.json({ message: "Sales Order not found" }, { status: 404 });
        }

        if (salesOrder.converted) {
            return NextResponse.json({ message: "Sales Order already converted" }, { status: 400 });
        }

        const so = await prisma.invoice.create({
            data: {
                salesOrder: salesOrder.id,
                customerId: salesOrder.customerId,
                converted: true,
                items: salesOrder.items ?? [],
                taxRate: salesOrder.taxRate,
                subTotal: salesOrder.subTotal,
                taxTotal: salesOrder.taxTotal,
                total: salesOrder.total,
                credit: salesOrder.credit,
                discount: salesOrder.discount,
                status: "draft",
                approved: false,
            },
        });

        await prisma.salesOrder.update({
            where: { id },
            data: {
                converted: true,
                status: 'so',
                approved: true,
            },
        });

        return NextResponse.json({ message: "Sales Order converted to Invoice", so }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
