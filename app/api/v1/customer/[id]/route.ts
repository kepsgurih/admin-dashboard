import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if(!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PATCH(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  if(!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  const data = await req.json();
  const updated = await prisma.customer.update({ where: { id }, data });
  return NextResponse.json(updated);
}