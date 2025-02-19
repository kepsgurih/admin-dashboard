import { prisma } from "@/lib/prisma";
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
  }
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
  }
  const data = await req.json();
  const customer = await prisma.customer.create({ data });
  return NextResponse.json(customer, { status: 201 });
}
