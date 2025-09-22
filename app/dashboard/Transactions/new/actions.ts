"use server";
import { db } from "@/db";
import { transactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { TransactionSchema } from "@/validation/transactionSchema";


export const createTransaction = async (data: {
  amount: number;
  transactionDate: string;
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
  const validation = TransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message,
    };
  }

   // ✅ add custom business rule (like preventing category 0)
  if (data.categoryId === 0) {
    return {
      error: true,
      message: "Invalid category",
    };
  }

  const [transaction] = await db
    .insert(transactionTable)
    .values({
      userId,
      amount: data.amount.toString(),
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
    })
    .returning();

  return {
    id: transaction.id,
  };
};
