"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditCustomerPage() {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id as string;

    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/${customerId}`);
                if (!res.ok) throw new Error("Customer not found");

                const data = await res.json();
                setCustomer(data);
            } catch (error) {
                toast.error("Error fetching customer");
                router.push("/apps/customers");
            }
        };

        fetchCustomer();
    }, [customerId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!customer.name || !customer.email) {
            toast.error("Name and Email are required");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer/${customerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
            });

            if (!res.ok) throw new Error("Failed to update customer");

            toast.success("Customer updated successfully");
            router.push("/apps/customers");
        } catch (error) {
            toast.error("Error updating customer");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-10">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <div className="space-y-4 mt-4">
                <div>
                    <Label>Name</Label>
                    <Input name="name" value={customer.name} onChange={handleChange} />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input name="email" type="email" value={customer.email} onChange={handleChange} />
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input name="phone" type="tel" value={customer.phone} onChange={handleChange} />
                </div>
                <div>
                    <Label>Address</Label>
                    <Input name="address" value={customer.address} onChange={handleChange} />
                </div>
                <div>
                    <Label>City</Label>
                    <Input name="city" value={customer.city} onChange={handleChange} />
                </div>
                <div>
                    <Label>Country</Label>
                    <Input name="country" value={customer.country} onChange={handleChange} />
                </div>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
