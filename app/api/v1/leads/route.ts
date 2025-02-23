import { prisma } from "@/lib/prisma";
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser()
  if (!user || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
  }
  const customers = await prisma.customer.findMany({
    where: {
      customerType: 'LEADS'
    }
  });
  return NextResponse.json(customers);
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || !user?.publicMetadata?.group) {
    return NextResponse.json({ message: 'Authorization failed, user not found' }, { status: 404 });
  }
  const data = await req.json();
  const body = {
    ...data,
    companyId: user?.publicMetadata?.group,
    customerType: 'LEADS'
  }
  const customer = await prisma.customer.create({
    data: body
  });
  return NextResponse.json({ message: 'Leads successfully created', data: customer }, { status: 201 });
}
