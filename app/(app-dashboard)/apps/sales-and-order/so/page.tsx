"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DataTable } from "@/components/table/table-customer/data-table";

interface Quotation {
    id: string;
    customerName: string;
    totalAmount: number;
    createdAt: string;
}

const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'No',
        header: 'No',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => row.original.customer.name
    },
    {
        accessorKey: "total",
        header: "Total Amount",
        cell: ({ row }) => `Rp ${row.original.total.toLocaleString()}`,
    },
    {
        accessorKey: "approved",
        header: "approved",
        cell: ({ row }) => row.original.approved ? "Yes" : "No"
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
        accessorKey: "Invoice",
        header: "Invoice",
        cell: ({ row }) => row.original.converted ? "Yes" : "No"
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <div className="flex gap-2">

                    <Button onClick={() => router.push(`/apps/sales-and-order/so/${row.original.id}`)}>View</Button>
                    {
                        row.original.status !== "CANCELLED" && row.original.status !== "COMPLETED" && (
                            <Button variant="secondary" onClick={() => router.push(`/apps/sales-and-order/so/edit/${row.original.id}`)}>Edit</Button>
                        )
                    }
                </div>
            );
        },
    },
];

export default function Page() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();

    useEffect(() => {
        fetch("/api/v1/document-so/SO")
            .then((res) => res.json())
            .then((data) => setQuotations(data))
            .catch(() => toast.error("Failed to fetch quotations"))
            .finally(() => {
                setLoading(false)
            })
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Order</CardTitle>
                <div className="flex justify-end">
                    <Button className="mb-4" onClick={() => router.push("/apps/sales-and-order/so/new")}>New Sales Order</Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={quotations} loading={loading} />
            </CardContent>
        </Card>
    );
}
