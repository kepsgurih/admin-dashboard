"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Lead name must be at least 3 characters.",
    }),
    email: z
        .string()
        .min(3, {
            message: "Email must be at least 3 characters.",
        })
        .email(),
    phone: z.string().min(3, {
        message: "Phone number must be at least 3 characters.",
    }),
    address: z.string().min(3, {
        message: "Address must be at least 3 characters.",
    }),
    city: z.string().min(3, {
        message: "City must be at least 3 characters.",
    }),
    country: z.string().min(3, {
        message: "Country must be at least 3 characters.",
    }),
    fromCompany: z.string(),
    jobTitle: z.string(),
    source: z.string(),
})

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id as string;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            country: "",
            fromCompany: "",
            jobTitle: "",
            source: "OTHER",
        },
    })

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Failed to create lead");
            const resp = await res.json();
            toast.success(resp.message);
            router.push(`/apps/crm/customers/${resp.data?.id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-10">
            <h1 className="text-2xl font-bold">New Customer</h1>
            <div className="space-y-4 mt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Keps Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="keps@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="088888888" type="tel" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fromCompany"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="jobTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="WEBSITE">Website</SelectItem>
                                                    <SelectItem value="GOOGLE">Google</SelectItem>
                                                    <SelectItem value="SOSMED">Social Media</SelectItem>
                                                    <SelectItem value="EVENT">Event</SelectItem>
                                                    <SelectItem value="REFERRAL">Referral</SelectItem>
                                                    <SelectItem value="LEADS">From Leads</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
                {/* <div>
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
                </Button> */}
            </div>
        </div>
    );
}
