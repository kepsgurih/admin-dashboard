import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser()
  if (!user || !user?.id) {
    return NextResponse.json({ message: 'Authorization failed' }, { status: 404 });
  }
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { id, customerType: 'CUSTOMER', companyId: user?.publicMetadata?.group as string } });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  const user = await currentUser()
  if (!user || !user?.id) {
    return NextResponse.json({ message: 'Authorization failed' }, { status: 404 });
  }
  try {
    const data = {
      ...await req.json(),
      companyId: user?.publicMetadata?.group,
      customerType: 'CUSTOMER'
    }
    const customer = await prisma.customer.update({ where: { id, customerType: 'CUSTOMER', companyId: user?.publicMetadata?.group as string }, data });
    return NextResponse.json({ message: 'Update successfully', data: customer }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}