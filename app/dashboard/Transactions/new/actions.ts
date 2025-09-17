"use server";

import { db } from "@/db";
import { transactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addDays, subYears } from "date-fns";
import { z } from "zod";

export const transactionScheme = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must contain a maximum of 300 characters"),
    categoryId: z.number().positive("Category Id is invalid"),
    transactionDate: z.coerce
            .date()
            .min(subYears(new Date(), 100), "Transaction date cannot be in the future").max(addDays(new Date(), 1)),
});

export const createTransaction = async (data: {
  amount: number;
  transactionData: string;
  description: string;
  categoryId: number;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      message: "unauthorized",
    };
  }
  const validation = transactionScheme.safeParse(data);

  if(!validation.success){
    return {
        error:true,
        message:validation.error.issues[0].message
    }
  }

  const [transaction] = await db.insert(transactionTable).values({
    userId,
    amount:data.amount.toString(),    
    description:data.description,
    categoryId: data.transactionData,
    transactionDate: data.transactionDate,
  }).returning();
  
  return {
    id:transaction.id,
  }
};
