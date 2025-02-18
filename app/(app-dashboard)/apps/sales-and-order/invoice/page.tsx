"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DataTable } from "@/components/table/table-customer/data-table";

interface invoiceI {
    id: string;
    customerName: string;
    totalAmount: number;
    createdAt: string;
}

const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'No',
        header: 'No',
        cell: ({row}) => row.index + 1
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({row}) => row.original.customer.name
    },
    {
        accessorKey: "total",
        header: "Total Amount",
        cell: ({ row }) => `Rp ${row.original.total.toLocaleString()}`,
    },
    {
        accessorKey: "approved",
        header: "approved",
        cell: ({row}) => row.original.approved ? "Yes" : "No"
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "updatedDate",
        header: "Last Update",
        cell: ({ row }) => new Date(row.original.updatedDate).toLocaleDateString(),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => new Date(row.original.createdDate).toLocaleDateString(),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`/apps/sales-and-order/invoice/${row.original.id}`)}>View</Button>
                    <Button variant="secondary" onClick={() => router.push(`/apps/sales-and-order/invoice/edit/${row.original.id}`)}>Edit</Button>
                </div>
            );
        },
    },
];

export default function InvoicePage() {
    const [invoice, setInvoice] = useState<invoiceI[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();

    useEffect(() => {
        fetch("/api/v1/invoice")
            .then((res) => res.json())
            .then((data) => setInvoice(data))
            .catch(() => toast.error("Failed to fetch quotations"))
            .finally(()=>{
                setLoading(false)
            })
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoice</CardTitle>
                <div className="flex justify-end">
                <Button className="mb-4" onClick={() => router.push("/apps/sales-and-order/invoice/new")}>New Invoice</Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={invoice} loading={loading} />
            </CardContent>
        </Card>
    );
}
