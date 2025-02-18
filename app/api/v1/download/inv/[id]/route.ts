import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextRequest, NextResponse } from "next/server";
import { FormatRupiah } from "@/lib/format";
import moment from "moment";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    // Fetch data invoice dari API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoice/${id}`);
    const invoice = await res.json();

    if (!invoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    // Konfigurasi Puppeteer untuk support di semua lingkungan
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless === "new" ? true : (chromium.headless === "false" ? false : true),
      defaultViewport: { width: 1280, height: 800 },
    });

    const page = await browser.newPage();

    // Buat HTML Invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; }
          .container { width: 100%; max-width: 750px; margin: auto; padding: 20px; border: 1px solid #ddd; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .table-invoice { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
          .table-invoice th, .table-invoice td { padding: 6px; border: 1px solid #ddd; text-align: right; }
          .table-invoice th { background-color: #333; color: white; text-transform: uppercase; }
          .total { font-weight: bold; background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invoice</h1>
            <p><strong>Date:</strong> ${moment(invoice.date).format('DD MMMM YYYY')}</p>
          </div>

          <p><strong>Client:</strong> ${invoice.customer.name}</p>
          <p><strong>Email:</strong> ${invoice.customer.email ?? '-'}</p>

          <table class="table-invoice">
            <thead>
              <tr>
                <th>No</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(invoice.items) ? invoice.items.map((item: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${FormatRupiah(item.unitPrice)}</td>
                  <td>${FormatRupiah(item.unitPrice * item.quantity)}</td>
                </tr>
              `).join("") : ""}
              <tr class="total">
                <td colspan="4">Total</td>
                <td>${FormatRupiah(invoice.total ?? 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "load" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${id}.pdf`,
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
