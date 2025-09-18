"use client"

import TransactionForm from "@/components/transaction-form";
import { type Category } from "@/types/Category";
import { z } from "zod";
import { transactionFormSchema } from "@/components/transaction-form";
import { createTransaction } from "./actions";
import { format } from "date-fns";
import toast from 'react-hot-toast';


export default function newTransactionForm({ categories }: {
  categories: Category[];

}) {

  type TransactionFormValues = z.infer<typeof transactionFormSchema>;
  const handleSubmit = async (data: TransactionFormValues) => {
    const result = await createTransaction({
      amount: data.amount,
      categoryId: data.categoryId,
      description: data.description,
      transactionDate: format(data.transactionDate, 'yyyy-MM-dd'),
    });
    console.log(result);
    if (result.error) {
      
      toast.error('Something went wrong');
    }

   
  }


  return (
    <TransactionForm onSubmit={handleSubmit} categories={categories} />
  );
}