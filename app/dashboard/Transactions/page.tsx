import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import z from "zod";
import { format } from "date-fns";
import { getTransactionByMonth } from "@/data/getTransactionByMonth";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const today = new Date();

const searchSchema = z.object({
    year: z.coerce.number().min(today.getFullYear() - 100).max(today.getFullYear() + 1).catch(today.getFullYear()),
    month: z.coerce.number().min(1).max(12).catch(today.getMonth() + 1),
});

export default async function Transactionspage({
    searchParams
}: {
    searchParams: Promise<{ year?: string; month?: string }>
}) {
    const searchParamsValues = await searchParams;
    const { month, year } = searchSchema.parse(searchParamsValues);

    const selectedDate = new Date(year, month - 1, 1);

    const transactions = await getTransactionByMonth({ month, year });

    return (
        <div className="max-w-screen-xl mx-auto py-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Transactions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <span>{format(selectedDate, "MMM yyy")} Transactions</span>
                        <div>
                            dropdowns
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button as Child>
                        <Link href="/dashboard/transactions/new">
                            New Transaction
                        </Link>
                    </Button>
                    {
                        !transactions?.length && (
                            <p className="text-center py-10 text-lg text-muted-foreground">There are no transactions for this month</p>
                        )
                    }
                    {
                        transactions?.length && (
                            <Table className="mt-4">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>

                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        )
                    }
                </CardContent>
            </Card>
        </div>
    );
}