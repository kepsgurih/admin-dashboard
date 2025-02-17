import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 📌 Get All Customers
export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers);
}

// 📌 Create Customer
export async function POST(req: Request) {
  const data = await req.json();
  const customer = await prisma.customer.create({ data });
  return NextResponse.json(customer, { status: 201 });
}
