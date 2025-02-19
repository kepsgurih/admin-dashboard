'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DataTable } from '@/components/table/table-customer/data-table';
import { columnCustomer } from '@/components/table/table-customer/column';
import { ICustomer } from 'types/api.types';
import { useState, useEffect } from 'react';
import SheetCustomer from './sheet-bottom';

export default function CustomersPage() {
  const [data, setData] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer`, {
          cache: 'no-store'
        });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>View all customers and their orders.</CardDescription>
        <SheetCustomer />
      </CardHeader>
      <CardContent>
        <DataTable columns={columnCustomer} data={data} loading={loading} />
      </CardContent>
    </Card>
  );
}
