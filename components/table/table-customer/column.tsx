"use client"

import { ColumnDef } from '@tanstack/react-table';
import { ICustomer } from '../../../types/api.types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit3, Eye, View } from 'lucide-react';

export const columnCustomer: ColumnDef<ICustomer>[] = [
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
          <Button size={'sm'} asChild><Link href={'/apps/customers/'+row.original.id}><Eye /></Link></Button>
        </div>
      )
    }
  }
];