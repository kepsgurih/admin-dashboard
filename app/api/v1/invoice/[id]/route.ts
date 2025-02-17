import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = (await params).id
    const quotation = await prisma.invoice.findUnique({
        include: {
            customer: true
        },
        where: {
            id
        }
    });
    return NextResponse.json(quotation);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // Gunakan await untuk menunggu parameter
    const data = await req.json();
    try {
        const quotation = await prisma.invoice.update({
            where: { id }, // Menentukan ID untuk melakukan update
            data, // Data yang diperbarui
        });

        return NextResponse.json(quotation, { status: 200 }); // Gunakan status 200 untuk update
    } catch (erro) {
        return NextResponse.json({ message: erro }, { status: 501 })
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params; // Gunakan await untuk menunggu parameter
    try {
        const invoices = await prisma.invoice.findUnique({
            include: {
                customer: true
            },
            where: {
                id
            }
        });
        if(invoices?.quotation){
            await prisma.quotation.update({
                where: { 
                    id: invoices?.quotation || undefined
                 }, // Menentukan ID untuk melakukan update
                data: {
                    converted: false
                }, // Data yang diperbarui
            });
        }

        await prisma.invoice.update({
            where: { 
                id: id
             }, // Menentukan ID untuk melakukan update
            data: {
                removed: true
            }, // Data yang diperbarui
        });

        return NextResponse.json({message: 'Success delete'}, { status: 200 }); // Gunakan status 200 untuk update
    } catch (erro) {
        return NextResponse.json({ message: erro }, { status: 501 })
    }
}


