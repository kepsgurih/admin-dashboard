"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DataTable } from "@/components/table/table-customer/data-table";
import { FormatRupiah } from "@/lib/format";

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
        accessorKey: "method",
        header: "Method",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => FormatRupiah(row.original.amount)
    },  
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "paidAt",
        header: "Paid At",
        cell: ({ row }) => new Date(row.original.paidAt).toLocaleDateString()
    },
];

export default function Page() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const router = useRouter();

    useEffect(() => {
        fetch("/api/v1/payment")
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
                <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={quotations} loading={loading} />
            </CardContent>
        </Card>
    );
}
