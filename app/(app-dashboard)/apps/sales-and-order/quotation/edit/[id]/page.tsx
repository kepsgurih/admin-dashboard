"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Plus, Minus, Trash } from "lucide-react";
import moment from "moment";
import { FormatRupiah } from "@/lib/format";

interface QuotationItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: string;
  name: string;
}

export default function EditQuotationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // state loading

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomerId(data.customer.id);
        setCustomerName(data.customer?.name || "Unknown");
        setDate(data.date.split("T")[0]);
        setItems(data.items.length > 0 ? JSON.parse(data.items) : []);
      })
      .catch(() => toast.error("Failed to fetch quotation"))
      .finally(() => setLoading(false)); // Set loading to false after fetch completes

    // Fetch customers
    fetch("/api/v1/customer")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(() => toast.error("Failed to fetch customers"));
  }, [id]);

  useEffect(() => {
    // Recalculate total when items change
    const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    setTotal(FormatRupiah(totalAmount)); // Format to 2 decimal places
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleIncreaseQuantity = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].quantity += 1;
    setItems(updatedItems);
  };

  const handleDecreaseQuantity = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
    }
    setItems(updatedItems);
  };

  const handleUpdate = async () => {
    // Validasi jika ada item dengan deskripsi kosong
    const invalidItem = items.find(item => !item.description.trim());
    if (invalidItem) {
      toast.error("Deskripsi pada setiap item harus diisi!");
      return;
    }

    setLoading(true); // Set loading to true while updating
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        date: moment(date).format(),
        total: items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0),
        items: JSON.stringify(items),
      }),
    });

    if (response.ok) {
      toast.success("Quotation updated successfully!");
      router.refresh(); // Reload page after update
    } else {
      toast.error("Failed to update quotation");
    }
    setLoading(false); // Set loading to false after update
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Edit Quotation</CardTitle>
          <Button size={"sm"} className="flex gap-2" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : <Save />} Update
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Customer and Total in the same row for tablet and laptop */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <Label>Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/2">
              <Label>Total</Label>
              <Input type="total" value={total} disabled />
            </div>
          </div>

          <div>
            <Label>Issue Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <h3 className="text-lg font-semibold mt-4">Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={item.description}
                      type="text"
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].description = e.target.value;
                        setItems(updatedItems);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDecreaseQuantity(index)}>
                        <Minus />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => handleIncreaseQuantity(index)}>
                        <Plus />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={Number(item.unitPrice)}
                      onChange={(e) => {
                        const updatedItems = [...items];
                        updatedItems[index].unitPrice = parseFloat(e.target.value);
                        setItems(updatedItems);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveItem(index)}>
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddItem} className="mt-2">
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
