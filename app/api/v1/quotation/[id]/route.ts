import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const quotation = await prisma.quotation.findUnique({
        include: {
            customer: true
        },
        where: {
            id
        }
    });
    return NextResponse.json(quotation);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const data = await req.json();
    try {
        const quotation = await prisma.quotation.update({
            where: { id }, // Menentukan ID untuk melakukan update
            data, // Data yang diperbarui
        });

        return NextResponse.json(quotation, { status: 200 }); // Gunakan status 200 untuk update
    } catch (erro) {
        return NextResponse.json({ message: erro }, { status: 501 })
    }

}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    try {
        // Cari quotation berdasarkan ID
        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: {
                customer: true
            }
        });

        if (!quotation) {
            return NextResponse.json({ message: "Quotation not found" }, { status: 404 });
        }

        // Cek jika quotation sudah dikonversi
        if (quotation.converted) {
            return NextResponse.json({ message: "Quotation already converted" }, { status: 400 });
        }

        console.log(quotation)

        // Membuat Invoice baru berdasarkan data dari Quotation
        const invoice = await prisma.invoice.create({
            data: {
                quotation: quotation.id,
                customerId: quotation.customerId,
                converted: true,
                // customer: {
                //     connect: { id: quotation.customerId }
                // },
                items: quotation.items ?? [],
                taxRate: quotation.taxRate,
                subTotal: quotation.subTotal,
                taxTotal: quotation.taxTotal,
                total: quotation.total,
                credit: quotation.credit,
                discount: quotation.discount,
                status: "draft",
                approved: false,
            },
        });

        // Menandai quotation sebagai sudah dikonversi
        await prisma.quotation.update({
            where: { id },
            data: {
                converted: true,
                status: 'invoiced',
                approved: true,
            },
        });

        return NextResponse.json({ message: "Quotation converted to invoice", invoice }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}


