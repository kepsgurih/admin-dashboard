"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SheetCustomer() {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
            });

            if (!res.ok) throw new Error("Failed to create customer");

            toast.success("Customer created successfully");
            setCustomer({
                name: "",
                email: "",
                phone: "",
                address: "",
                city: "",
                country: "",
            }); // Reset form
        } catch (error) {
            toast.error("Error creating customer");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex justify-end">
                    <Button>New Customer</Button>
                </div>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-[600px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Create New Customer</SheetTitle>
                    <SheetDescription>This will add a new customer to the database.</SheetDescription>
                </SheetHeader>
            <ScrollArea className="w-full h-full rounded-md border p-4"> 
                <div className="space-y-4 mt-4 mx-2">
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
                        {isLoading ? "Saving..." : "Save Customer"}
                    </Button>
                </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
