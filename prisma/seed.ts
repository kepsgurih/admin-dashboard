const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const customer = await prisma.customer.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "customer@example.com",
      phone: "1234567890",
      address: "123 Main St",
      city: "Jakarta",
      country: "Indonesia",
    },
  });

  await prisma.quotation.create({
    data: {
      date: new Date(),
      expiredDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      customerId: customer.id,
      items: JSON.stringify([
        { description: "Item 1", quantity: 2, unitPrice: 100, totalPrice: 200 },
      ]),
      taxRate: 10,
      subTotal: 200,
      taxTotal: 20,
      total: 220,
      discount: 0,
      status: "pending",
      approved: false,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date(),
      expiredDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      customerId: customer.id,
      items: JSON.stringify([
        { description: "Item 1", quantity: 2, unitPrice: 100, totalPrice: 200 },
      ]),
      taxRate: 10,
      subTotal: 200,
      taxTotal: 20,
      total: 220,
      discount: 0,
      status: "unpaid",
      approved: false,
    },
  });

  console.log("Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
