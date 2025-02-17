import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quotation = await prisma.quotation.findMany({
    include: {
        customer: true
    },
    where: {
      removed: false
    }
  });
  return NextResponse.json(quotation);
}

export async function POST(req: Request) {
  const data = await req.json();
  const quotation = await prisma.quotation.create({ data });
  return NextResponse.json(quotation, { status: 201 });
}
