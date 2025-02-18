import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

        // Update field 'removed' menjadi true
        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: {
                removed: true, // Menandai quotation sebagai "removed"
            },
        });

        return NextResponse.json({ message: "Quotation marked as removed", updatedQuotation }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error || "Internal server error" }, { status: 500 });
    }
}
