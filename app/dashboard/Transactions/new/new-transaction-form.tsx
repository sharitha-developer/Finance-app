"use client"

import TransactionForm from "@/components/transaction-form";
import { type Category } from "@/types/Category";
import { z } from "zod";
import { transactionFormScheme } from "@/components/transaction-form";
import { createTransaction } from "./actions";
import { format } from "date-fns";

export default function newTransactionForm({categories} : {
    categories: Category[];
    
}){

 type TransactionFormValues = z.infer<typeof transactionFormScheme>;   
 const handleSubmit = async (data: TransactionFormValues) => {
   const result = await createTransaction({
    amount: data.amount,    
    categoryId: data.categoryId,
    description: data.description,
    transactionDate: format(data.transactionDate, 'yyyy-MM-DD'),
   });
 };
 return (
  <TransactionForm onSubmit={handleSubmit}  categories={categories} />
); 
}