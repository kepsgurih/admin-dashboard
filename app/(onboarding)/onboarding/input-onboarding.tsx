"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
    name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    phone: z.string().min(2, { message: "Phone number must be at least 2 characters." }),
    address: z.string().min(2, { message: "Address must be at least 2 characters." }),
    city: z.string().min(2, { message: "City must be at least 2 characters." }),
    country: z.string().min(2, { message: "Country must be at least 2 characters." }),
    website: z.string().min(3, { message: "Website must be at least 3 characters." }),
});

export default function InputOnboarding() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoaded && user?.publicMetadata?.group) {
            router.push("/apps");
        }
    }, [isLoaded, user, router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            country: "",
            website: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await fetch("/api/v1/company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result = await res.json();
            if (!res.ok) {
                toast.error(result.message);
                setLoading(false);
                return;
            }
            toast.success(result.message)
            if (user) {
                await user.reload();
            }
            router.refresh();
            router.push("/apps");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen min-w-full">
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Create Company</CardTitle>
                        <CardDescription>Create your own company here</CardDescription>
                    </CardHeader>
                    {loading ? (
                        <p className="text-center animate animate-pulse animate-bounce">Loading ...</p>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {["name", "email", "phone", "address", "city", "country", "website"].map(
                                        (field) => (
                                            <FormField
                                                key={field}
                                                control={form.control}
                                                name={field as keyof z.infer<typeof formSchema>}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={`Enter ${field.name}`} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )
                                    )}
                                </div>
                                <Button className="w-full" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
