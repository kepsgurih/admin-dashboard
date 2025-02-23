import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ slug: string, id: string }>
export async function POST(req: NextRequest, segment: {params: Params}) {
    const params = await segment.params 
    const user = await currentUser();
    const { slug, id } = params;
    const body = await req.json();

    if (!user || !user?.publicMetadata?.group) {
        return NextResponse.json({ message: "Authorization failed, user not found" }, { status: 404 });
    }
    if (!slug) {
        return NextResponse.json({ message: "Slug not found" }, { status: 404 });
    }
    if (!id) {
        return NextResponse.json({ message: "ID not found" }, { status: 404 });
    }
    if (slug !== "INV") {
        return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    try {
        const currentDocument = await prisma.documentSO.findUnique({
            where: {
                id,
                companyId: user?.publicMetadata?.group as string,
                type: "INV",
            },
        });

        if (!currentDocument || (currentDocument.status !== "SENT" && currentDocument.status !== "PARTIALLY PAID")) {
            return NextResponse.json({ message: "Document not found or not eligible for payment" }, { status: 404 });
        }

        // Ambil semua pembayaran sebelumnya
        const previousPayments = await prisma.payment.findMany({
            where: {
                documentSoId: currentDocument.id,
                companyId: user?.publicMetadata?.group as string,
            },
        });

        // Hitung total pembayaran sebelumnya
        const totalPaid = previousPayments.reduce((acc, payment) => acc + Number(payment.amount), 0);
        const newTotalPaid = totalPaid + Number(body.amount);

        console.log("currentDocument.total:", currentDocument.total);
        console.log("totalPaid:", totalPaid, "newTotalPaid:", newTotalPaid);

        // Tentukan status baru berdasarkan total pembayaran
        const newStatus = newTotalPaid >= Number(currentDocument.total) ? "PAID" : "PARTIALLY PAID";

        // Update status dokumen
        const updatedDocument = await prisma.documentSO.update({
            where: { id },
            data: { status: newStatus },
        });

        // Buat entri pembayaran baru
        await prisma.payment.create({
            data: {
                documentSoId: updatedDocument.id,
                companyId: user?.publicMetadata?.group as string,
                amount: body.amount,
                method: body.method,
                status: "PAID",
                paidAt: new Date(),
            },
        });

        return NextResponse.json({
            message: "Payment success, document updated",
            data: updatedDocument,
        });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Something went wrong", error },
            { status: 500 }
        );
    }
}
