import puppeteer from "puppeteer";
import { NextRequest } from "next/server";
import { FormatRupiah } from "@/lib/format";
import moment from "moment";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = (await params).id;

  try {
    // Fetch data invoice dari database atau API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoice/${id}`);
    const invoice = await res.json();

    if (!invoice) {
      return new Response("Invoice not found", { status: 404 });
    }

    // Membuka browser puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set viewport untuk memastikan konten sepenuhnya ditampilkan
    await page.setViewport({ width: 1280, height: 800 });

    // Buat HTML untuk PDF
    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invoice</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-size: 10px;
    }
    body {
      font-family: 'Arial', sans-serif;
      background-color: #F4F4F4;
      color: #3A506B;
      font-size: 12px;
      padding: 20px;
    }
    .container {
      max-width: 750px;
      background: white;
      padding: 20px;
      margin: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      display: block;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #3A506B;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }
    .company-info {
      display: block; 
      text-align: right;
      font-size: 12px;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: bold;
      color: #3A506B;
      margin: 0;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 8px;
    }
    .table-invoice {
  width: 100%;
  margin-top: 10px;
  font-size: 8px;
  border-collapse: collapse; /* Ensure table borders are collapsed */
  border: 1px solid #3A506B;
}
.table-invoice th, .table-invoice td {
  padding: 6px;
  text-align: right;
  border: 1px solid #3A506B; /* Add border for better visibility */
}

.table-invoice th {
  background-color: #3A506B; /* Ensure background color is applied */
  color: white;
  text-transform: uppercase;
  font-weight: normal;
}

.table-invoice tbody tr:nth-child(even) {
  background-color: #E4E4E4; /* Apply background color for even rows */
}

.total {
  font-weight: bold;
  background-color: #DCE2F0; /* Ensure background color is applied */
}

@media print {
  body {
    background: #ffffff;
  }
  .container {
    background: #ffffff !important;
  }
  .header {
    background: rgb(207, 104, 104) !important;
  }
  .table-invoice th, .table-invoice td {
    background-color: #E4E4E4 !important; /* Ensure table background during print */
  }
}

  </style>
</head>
<body>
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <div>
        <h1 class="invoice-title">Invoice</h1>
        <p>Date: ${moment(invoice.date).format('DD MMMM YYYY')}</p>
        <p>Expired Date: ${moment(invoice.date).format('DD MMMM YYYY')}</p>
        <p>Number: INV/${moment(invoice.createdDate).format('DD/DDD/MM/YY')}</p>
      </div>
      <div class="company-info">
        <p><strong>Kepsgurih Data</strong></p>
      </div>
    </div>

    <!-- Client Details -->
    <div class="details">
      <div>
        <p><strong>Client:</strong></p>
        <p>${invoice.customer.name}</p>
        <p>${invoice.customer.address ?? ''}</p>
        <p>${invoice.customer.city ?? ''}</p>
        <p>${invoice.customer.country ?? ''}</p>
      </div>
      <div>
        <p><strong>Phone:</strong> ${invoice.customer.phone ?? ''}</p>
        <p><strong>Email:</strong> ${invoice.customer.email ?? ''}</p>
      </div>
    </div>

    <!-- Invoice Items -->
    <table class="table-invoice">
      <thead class="theads">
        <tr>
        <th>No</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      ${JSON.parse(invoice.items || "[]")
        .map(
          (item: any, index:number) => `
        <tr>
<td>${index + 1}</td>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${FormatRupiah(item.unitPrice)}</td>
          <td>${FormatRupiah(Number(item.unitPrice) * Number(item.quantity))}</td>
        </tr>
      `
        )
        .join("")}
        <tr class="total">
          <td colspan="4">Total</td>
          <td>${FormatRupiah(invoice.total ?? 0) ?? 0}</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer Section -->
    <div class="footer">
      <p>Invoice was created digitally - Kepsgurih ERP</p>
    </div>
  </div>
</body>
</html>
    `;

    // Set konten HTML di halaman Puppeteer
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
    return new Response("Internal Server Error", { status: 500 });
  }
}
