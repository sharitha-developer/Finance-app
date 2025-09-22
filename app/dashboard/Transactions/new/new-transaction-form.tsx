"use client"

import TransactionForm from "@/components/transaction-form";
import { type Category } from "@/types/Category";
import { z } from "zod";
import { transactionFormSchema } from "@/components/transaction-form";
import { createTransaction } from "./actions";
import { format } from "date-fns";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";


export default function NewTransactionForm({ categories }: {
  categories: Category[];

}) {
  const router = useRouter();
  type TransactionFormValues = z.infer<typeof transactionFormSchema>;
  const handleSubmit = async (data: TransactionFormValues) => {

    const result = await createTransaction({
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
    });

    if (result.error) {
      toast.error(result.message || "Something went wrong");
      return;
    } else {
      toast.success("Transaction created successfully!");
    }

    router.push(`/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`)
  }


  return (
    <TransactionForm onSubmit={handleSubmit} categories={categories} />
  );
}