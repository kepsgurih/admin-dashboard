import { prisma } from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser()
  if (!user || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Authorization failed' }, { status: 404 });
  }
  try {
    const customers = await prisma.customer.findMany({
      where: {
        companyId: user?.publicMetadata?.group,
        customerType: 'CUSTOMER'
      }
    });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Authorization failed' }, { status: 404 });
  }
  try {
    const data = {
      ...await req.json(),
      companyId: user?.publicMetadata?.group,
      customerType: 'CUSTOMER'
    }
    const customer = await prisma.customer.create({ data });
    return NextResponse.json({ message: 'Customer successfully created', data: customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Something went wrong", error }, { status: 500 });
  }
}
