'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/table-customer/data-table';
import moment from 'moment';
import { FormatRupiah } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, FilePlus, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function QuotationDetailPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}`);
        if (!response.ok) throw new Error('Failed to fetch quotation');

        const data = await response.json();
        setQuotation(data);
      } catch (error) {
        console.error('Error fetching quotation:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotation();
  }, [id]);

  const handleConvertToInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}`, {
        method: "POST",
      });
  
      const result = await response.json();
  
      // Jika berhasil, tampilkan toast success dengan pesan dari API
      if (response.ok) {
        toast.success(result.message || "Quotation successfully converted to invoice");
        router.push('/apps/invoice')
      } else {
        // Jika gagal, tampilkan toast error dengan pesan dari API
        toast.error(result.message || "An error occurred while converting quotation");
      }
    } catch (error) {
      console.error(error);
      // Jika ada error dalam request, tampilkan toast error
      toast.error("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };
  


  const handlePrintPDF = async () => {
    const pdfUrl = `/api/v1/download/quote/${id}`;
    
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
      link.download = `quotation_${id}.pdf`;
      
      // Programatically klik untuk mulai download
      link.click();
      
      // Release URL setelah selesai
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };
  

  const handleDeleteQuotation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}/delete`, {
        method: "POST",
      });
  
      const result = await response.json();
  
      // Jika berhasil, tampilkan toast success dengan pesan dari API
      if (response.ok) {
        toast.success(result.message || "Quotation delete");
        router.push('/apps/quotation')
      } else {
        // Jika gagal, tampilkan toast error dengan pesan dari API
        toast.error(result.message || "An error occurred while delete quotation");
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
            <CardTitle>Quotation Details</CardTitle>
            <CardDescription>
              Detail of quotation{' '}
              {loading ? <Skeleton className="h-5 w-32 inline-block" /> : `#${quotation.id}`}
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
              <DropdownMenuItem onClick={handleConvertToInvoice}>
                <FilePlus size={16} className="mr-2" /> Convert to Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintPDF}>
                <Printer size={16} className="mr-2" /> Print PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteQuotation} className="text-red-600">
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
                <strong>Customer:</strong> {quotation?.customer?.name}
              </p>
              <p>
                <strong>Document Number:</strong> {`QUOTE/${moment(quotation.createdDate).format('DD/DDD/MM/YY')}`}
              </p>
              <p>
                <strong>Issue Date:</strong> {moment(quotation.issueDate).format('DD MMMM YYYY HH:mm')}
              </p>
              {quotation.validUntil && (
                <p>
                  <strong>Valid Until:</strong> {moment(quotation.validUntil).format('DD MMM YYYY HH:mm')}
                </p>
              )}
              <p>
                <strong>Total Amount:</strong> {FormatRupiah(quotation.total)}
              </p>
              <p>
                <strong>Status:</strong> <Badge>{quotation.status}</Badge>
              </p>
            </div>
          )}
          <h3 className="text-lg font-bold mt-6">Items</h3>
          <DataTable columns={columns} data={quotation?.items && quotation?.items.length > 0 ? JSON.parse(quotation?.items) : []} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
