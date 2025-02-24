'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/table-customer/data-table';
import moment from 'moment';
import { FormatRupiah } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, FilePlus, Trash2, MoreVertical, CircleMinus, Send, Banknote } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { PdfGenerator } from '@/components/print/print-so';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface PaymntMtd {
  amount: number,
  method: string
}
export default function QuotationDetailPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter()
  const [pm, setPm] = useState<PaymntMtd>({
    amount: 0,
    method: ""
  })
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/INV/${id}`);
        const result = await response.json();
        if (!response.ok) {
          toast.error(result.message)
          setError(response.status + ':  ' + result.message);
        }
        setQuotation(result);
      } catch (error) {
        console.error('Error fetching sales order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotation();
  }, [id]);


  const handleDeleteQuotation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}/delete`, {
        method: "POST",
      });

      if (!response.ok) {
        toast.error("An error occurred while delete quotation")
      }
      const result = await response.json();
      router.push('/apps/sales-and-order/quotation')
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
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

  const pdfRef = useRef<{ generatePDF: () => void } | null>(null);

  const handleUpdate = async (val: any) => {
    setLoading(true); // Set loading to true while updating
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/INV/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(val),
      });
      const result = await response.json();
      toast.success(result.message);
      setQuotation(result.data);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  };
  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/INV/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pm)
      });
      const result = await res.json();
      toast.success(result.message);
      setOpen(false);
      setQuotation(result.data);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
        <Skeleton className="h-6 w-32 mt-2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={() => router.push('/apps/sales-and-order/quotation')} className="mt-4">
          Back to Quotations
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Invoice {quotation?.customer?.name ?? ''}</CardTitle>
            <CardDescription>
              Detail of invoice{' '}
              {loading ? <Skeleton className="h-5 w-32 inline-block" /> : `#${quotation.id}`}
            </CardDescription>
          </div>
          {
            !loading && (
              <PdfGenerator ref={pdfRef} dataPage={quotation} copNumber={`INV/${moment(quotation.createdDate).format('DD/DDD/MM/YY')}`} />
            )
          }
          {
            loading ? (
              <Skeleton className="h-5 w-32 inline-block" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <MoreVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {
                    quotation.status === "DRAFT" && (
                      <DropdownMenuItem onClick={() => handleUpdate({ status: "SENT" })}>
                        <Send size={16} className="mr-2" /> Send
                      </DropdownMenuItem>
                    )
                  }
                  {
                    (quotation.status === "SENT" || quotation.status === "PARTIALLY PAID") && (
                      <DropdownMenuItem onClick={() => setOpen(!open)}>
                        <Banknote size={16} className="mr-2" /> Pay
                      </DropdownMenuItem>
                    )
                  }
                  {
                    quotation.status !== "CANCELLED" && quotation.status !== "REFUNDED" && (
                      <DropdownMenuItem onClick={() => pdfRef.current?.generatePDF()}>
                        <Printer size={16} className="mr-2" /> Print PDF
                      </DropdownMenuItem>
                    )
                  }
                  {
                    quotation.status === "DRAFT" && (
                      <DropdownMenuItem onClick={handleDeleteQuotation} className="text-red-600">
                        <Trash2 size={16} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    )
                  }
                  {
                    quotation.status === "SENT" && (
                      <DropdownMenuItem onClick={() => handleUpdate({ status: "REFUNDED" })} className="text-red-600">
                        <CircleMinus size={16} className="mr-2" /> Reject
                      </DropdownMenuItem>
                    )
                  }

                </DropdownMenuContent>
              </DropdownMenu>

            )
          }
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
                <strong>Document Number:</strong> {`INV/${moment(quotation.createdDate).format('DD/DDD/MM/YY')}`}
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
      <Sheet open={open}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Payment Method</SheetTitle>
            <SheetDescription>
              Please fill in your payment method
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-left">
                Payment Method
              </Label>
              <Input id="method" value={pm.method} onChange={(e) => setPm({ ...pm, method: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-left">
                Amount
              </Label>
              <Input id="amount" value={pm.amount} onChange={(e) => setPm({ ...pm, amount: Number(e.target.value) })} className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handlePayment}>Pay</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
