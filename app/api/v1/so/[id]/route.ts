import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const quotation = await prisma.salesOrder.findUnique({
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
        const quotation = await prisma.salesOrder.update({
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
        const so = await prisma.salesOrder.findUnique({
            include: {
                customer: true
            },
            where: {
                id
            }
        });
        if (so?.quotation) {
            await prisma.quotation.update({
                where: {
                    id: so?.quotation || undefined
                }, // Menentukan ID untuk melakukan update
                data: {
                    converted: false
                }, // Data yang diperbarui
            });
        }

        await prisma.salesOrder.update({
            where: {
                id: id
            }, // Menentukan ID untuk melakukan update
            data: {
                removed: true
            }, // Data yang diperbarui
        });

        return NextResponse.json({ message: 'Success delete' }, { status: 200 }); // Gunakan status 200 untuk update
    } catch (erro) {
        return NextResponse.json({ message: erro }, { status: 501 })
    }
}


