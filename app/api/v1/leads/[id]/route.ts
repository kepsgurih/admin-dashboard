import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser()
  if (!user || !user?.id  || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
  }
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const customer = await prisma.customer.findUnique({ where: { id, customerType: 'LEADS', companyId: user?.publicMetadata?.group as string } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser()
  if (!user || !user?.id || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
  }
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const data = await req.json();
    const updated = await prisma.customer.update({ where: { id, customerType: 'LEADS', companyId: user?.publicMetadata?.group as string }, data });
    return NextResponse.json({message: 'Leads updated successfully', data: updated}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    if (!user || !user?.id  || !user?.publicMetadata?.group) {
      return NextResponse.json({ message: 'Tidak diijinkan' }, { status: 404 });
    }
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const customer = await prisma.customer.delete({ where: { id, customerType: 'LEADS', companyId: user?.publicMetadata?.group as string } });
    return NextResponse.json({ message: 'Leads deleted successfully', data: customer }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}