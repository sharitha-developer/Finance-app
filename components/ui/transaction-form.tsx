"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "./form";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { SelectItem } from "./select";

const transactionFormScheme = z.object({
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

export default function TransactionForm() {
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormScheme) as any, // ✅ this should now type-check
        defaultValues: {
            amount: 0,
            categoryId: 0,
            description: "",
            transactionDate: new Date(),
            transactionType: "income",
        },
    });

    const handleSubmit = async (data: TransactionFormValues) => {

    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} >
            <FormField control={form.control} name="transactionType" render={({ field }) => {
                return (
                    <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
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
        </form>
    </Form>;
}
