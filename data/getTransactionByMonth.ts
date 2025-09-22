import "server-only";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { transactionTable } from "@/db/schema";
import { format } from "date-fns";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export async function getTransactionByMonth({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const earliestDate = new Date(year, month - 1, 1);
  const latestDate = new Date(year, month, 0);
  const transactions = await db
    .select()
    .from(transactionTable)
    .where(
      and(
        eq(transactionTable.userId, userId),
        gte(
          transactionTable.transactionDate,
          format(earliestDate, "yyyy-MM-dd")
        ),
        lte(transactionTable.transactionDate, format(latestDate, "yyyy-MM-dd"))
      )
    ).orderBy(desc(transactionTable.transactionDate));
  return transactions;
}
