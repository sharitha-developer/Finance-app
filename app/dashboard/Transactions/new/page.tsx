import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";

export default function NewTransactionPage() {
    return (
        
        <div className="max-w-screen-xl mx-auto py-10">
            <Link href="/">Home</Link>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/dashboard/transactions">Transactions</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                     <BreadcrumbItem>
                        <BreadcrumbPage>New Transaction</BreadcrumbPage>
                    </BreadcrumbItem>                    
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="mt-4 max-w-screen-md">
               <CardHeader>
                
               </CardHeader>
            </Card>
        </div>
    );
}