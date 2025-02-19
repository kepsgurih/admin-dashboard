'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/table-customer/data-table';
import moment from 'moment';
import { FormatRupiah } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, FilePlus, Trash2, MoreVertical, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function invoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setinvoice] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    async function fetchinvoice() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoice/${id}`);
        if (!response.ok) throw new Error('Failed to fetch invoice');

        const data = await response.json();
        setinvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchinvoice();
  }, [id]);

  const handlePrintPDF = async () => {
    const pdfUrl = `/api/v1/download/inv/${id}`;

    try {
      // Fetch file PDF dari server
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();

      // Membuat URL untuk file PDF
      const url = window.URL.createObjectURL(blob);

      // Membuat elemen <a> untuk melakukan download PDF
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${id}.pdf`;

      // Programatically klik untuk mulai download
      link.click();

      // Release URL setelah selesai
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoice/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: 'paid'
        })
      });

      const result = await response.json();

      // Jika berhasil, tampilkan toast success dengan pesan dari API
      if (response.ok) {
        toast.success(result.message || "Invoice paid");
        router.push('/apps/sales-and-order/invoice')
      } else {
        // Jika gagal, tampilkan toast error dengan pesan dari API
        toast.error(result.message || "An error occurred while paid");
      }
    } catch (error) {
      console.error(error);
      // Jika ada error dalam request, tampilkan toast error
      toast.error("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteinvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/invoice/${id}`, {
        method: "POST"
      });

      const result = await response.json();

      // Jika berhasil, tampilkan toast success dengan pesan dari API
      if (response.ok) {
        toast.success(result.message || "Invoice Deleted");
        router.push('/apps/sales-and-order/invoice')
      } else {
        // Jika gagal, tampilkan toast error dengan pesan dari API
        toast.error(result.message || "An error occurred while delete invoice");
      }
    } catch (error) {
      console.error(error);
      // Jika ada error dalam request, tampilkan toast error
      toast.error("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'quantity', header: 'Quantity' },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => FormatRupiah(row.original.unitPrice),
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        {/* ✅ Header: Judul di kiri, tombol di kanan */}
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          {/* 🏷️ Bagian Kiri - Judul */}
          <div>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>
              Detail of Invoice{' '}
              {loading ? <Skeleton className="h-5 w-32 inline-block" /> : `#${invoice.id}`}
            </CardDescription>
          </div>

          {/* 🔽 Dropdown Menu di semua ukuran layar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePay}>
                <DollarSign size={16} className="mr-2" /> Pay
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintPDF}>
                <Printer size={16} className="mr-2" /> Print PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteinvoice} className="text-red-600">
                <Trash2 size={16} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
              <p>
                <strong>Customer:</strong> {invoice?.customer?.name}
              </p>
              <p>
                <strong>Document Number:</strong> {`INVOICE/${moment(invoice.createdDate).format('DD/DDD/MM/YY')}`}
              </p>
              <p>
                <strong>Issue Date:</strong> {moment(invoice.issueDate).format('DD MMMM YYYY HH:mm')}
              </p>
              {invoice.validUntil && (
                <p>
                  <strong>Valid Until:</strong> {moment(invoice.validUntil).format('DD MMM YYYY HH:mm')}
                </p>
              )}
              <p>
                <strong>Total Amount:</strong> {FormatRupiah(invoice.total)}
              </p>
              <p>
                <strong>Status:</strong> <Badge>{invoice.status}</Badge>
              </p>
            </div>
          )}
          <h3 className="text-lg font-bold mt-6">Items</h3>
          <DataTable columns={columns} data={invoice?.items && invoice?.items.length > 0 ? JSON.parse(invoice?.items) : []} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
