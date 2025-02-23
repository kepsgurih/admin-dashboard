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
import { Printer, FilePlus, Trash2, MoreVertical, Stamp, CircleMinus, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { PdfGenerator } from '@/components/print/print-so';

export default function QuotationDetailPage() {
  const { id } = useParams();
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter()

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/QUOTE/${id}`);
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

  const handleConvertToSalesOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/QUOTE/${id}/convert`, {
        method: "POST",
        body: JSON.stringify({
          type: "SO",
          status: "DRAFT",
        }),
      });
      if (!response.ok) {
        toast.error("An error occurred while delete quotation")
      }
      const result = await response.json();
      toast.success(result.message);
      router.push('/apps/sales-and-order/so/' + result.data.id)
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (val: any) => {
    setLoading(true); // Set loading to true while updating
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/QUOTE/${id}`, {
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

  const handleDeleteQuotation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/document-so/QUOTE/${id}`, {
        method: "DELETE",
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

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Quotation Details</CardTitle>
            <CardDescription>
              Detail of quotation{' '}
              {loading ? <Skeleton className="h-5 w-32 inline-block" /> : `#${quotation.id}`}
            </CardDescription>
          </div>
          {
            !loading && (
              <PdfGenerator ref={pdfRef} dataPage={quotation} copNumber={`QUOTE/${moment(quotation.createdDate).format('DD/DDD/MM/YY')}`} />
            )
          }
          {
            loading ? (
              <Skeleton className="h-5 w-32 inline-block" />
            ) : (
              <>
                {
                  quotation.status !== "REJECTED" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-2">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {
                          quotation.status !== "DRAFT" && quotation.status !== "expired" && quotation.status !== "REJECTED" && (
                            <DropdownMenuItem onClick={handleConvertToSalesOrder}>
                              <FilePlus size={16} className="mr-2" /> Convert to Sales Order
                            </DropdownMenuItem>
                          )
                        }
                        {quotation.status === "DRAFT" && (
                          <DropdownMenuItem onClick={() => handleUpdate({ status: "APPROVED" })}>
                            <Stamp size={16} className="mr-2" /> Approve
                          </DropdownMenuItem>
                        )
                        }
                        {quotation.status === "APPROVED" && (
                          <DropdownMenuItem onClick={() => handleUpdate({ status: "SENT" })}>
                            <Send size={16} className="mr-2" /> Sent
                          </DropdownMenuItem>
                        )
                        }

                        {
                          quotation.status !== "DRAFT" && quotation.status !== "REJECTED" && quotation.status !== "EXPIRED" && (
                            <>
                              <DropdownMenuItem onClick={() => pdfRef.current?.generatePDF()}>
                                <Printer size={16} className="mr-2" /> Print PDF
                              </DropdownMenuItem>
                            </>
                          )
                        }

                        {
                          quotation.status !== "DRAFT" ? (
                            <DropdownMenuItem onClick={() => handleUpdate({ status: "REJECTED" })} className="text-red-600">
                              <CircleMinus size={16} className="mr-2" /> Reject
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={handleDeleteQuotation} className="text-red-600">
                              <Trash2 size={16} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          )
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
              </>

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
                <strong>Status:</strong> <Badge variant={quotation.status === "REJECTED" ? "destructive" : "default"}>{quotation.status}</Badge>
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
