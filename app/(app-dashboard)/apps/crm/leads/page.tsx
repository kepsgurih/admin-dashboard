'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DataTable } from '@/components/table/table-customer/data-table';
import { ICustomer } from 'types/api.types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeIcon, Trash2Icon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [data, setData] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/leads`);

        if (!res.ok) {
          throw new Error('Failed to fetch customer');
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching customers: ', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/leads/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete customer');
      }
      const result = await res.json();
      setData(data.filter((customer) => customer.id !== id));
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const columnCustomer: ColumnDef<ICustomer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Phone'
    },
    {
      accessorKey: 'city',
      header: 'City'
    },
    {
      accessorKey: 'country',
      header: 'Country'
    },
    {
      id: 'action',
      cell: ({ row }) => {
        return (
          <div className='flex flex-row gap-3'>
            <Button size={'sm'} asChild><Link href={'/apps/crm/leads/' + row.original.id}><EyeIcon /></Link></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size={'sm'} variant="destructive"><Trash2Icon /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(row?.original?.id as string)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        )
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>View all leads and their orders.</CardDescription>
        <div className='flex justify-end'>
          <Button onClick={() => router.push('/apps/crm/leads/new')}>New Leads</Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columnCustomer} data={data} loading={loading} />
      </CardContent>
    </Card>
  );
}
