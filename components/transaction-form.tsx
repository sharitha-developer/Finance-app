"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type Category } from "@/types/Category";

// shadcn/ui form primitives
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // ✅ use shadcn/ui select wrapper
import { SelectItem } from "@/components/ui/select"; // same file usually

import * as React from "react"
import { useMemo } from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input";

export const transactionFormScheme = z.object({
    transactionType: z.enum(["income", "expense"]),
    categoryId: z.coerce.number().positive("Please Select a category"),
    transactionDate: z.coerce
        .date()
        .max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    description: z
        .string()
        .min(3, "Description must contain at least 3 characters")
        .max(300, "Description must contain a maximum of 300 characters"),
});

// ✅ Strongly typed form values
type TransactionFormValues = z.infer<typeof transactionFormScheme>;

export default function TransactionForm({ categories, onSubmit }: {
    categories: Category[];
    onSubmit: (data: TransactionFormValues) => Promise<void>
}) {
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormScheme), // ✅ this should now type-check
        defaultValues: {
            amount: 0,
            categoryId: 0,
            description: "",
            transactionDate: new Date(),
            transactionType: "income",
        },
    });


    const transactionType = form.watch("transactionType");

    const filteredCategories = useMemo(() => {
        return categories.filter(c => c.type === transactionType);
    }, [categories, transactionType]);


    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="grid grid-cols-2 gap-y-5 gap-x-2">
                <FormField control={form.control} name="transactionType" render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={(newValue) => {
                                    field.onChange(newValue);
                                    form.setValue("categoryId", 0)
                                }} value={field.value}
                                >
                                    <SelectTrigger className=" w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">
                                            Income
                                        </SelectItem>
                                        <SelectItem value="expense">
                                            Expense
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
                <FormField control={form.control} name="categoryId" render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value.toString()}>
                                    <SelectTrigger className=" w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />

                <FormField control={form.control} name="transactionDate" render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Transaction Date</FormLabel>
                            <FormControl>
                                <Popover >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!field.value}
                                            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={{ after: new Date(), }} />
                                    </PopoverContent>
                                </Popover>

                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
                <FormField control={form.control} name="amount" render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
            </fieldset>
            <fieldset className="mt-5 flex flex-col gap-5">
                <FormField control={form.control} name="description" render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }} />
                <Button type="submit">
                    Submit
                </Button>
            </fieldset>

        </form>
    </Form>;
}
