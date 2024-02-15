

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
//import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data'
import { fetchCardData, fetchCustomers } from '@/app/lib/data' // fetchRevenue, fetchLatestInvoices removed
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton } from '@/app/ui/skeletons';
import { lusitana } from '@/app/ui/fonts';
import { auth } from '@/app/../auth';

 
export default async function Page() {
  let session = await auth();
  const sessionUserEmail = session?.user?.email ?? '';

  const customers = await fetchCustomers();
  
  // const revenue = await fetchRevenue() // removed
  //const latestInvoices = await fetchLatestInvoices();
  //const {numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = await fetchCardData(sessionUserEmail);
  return (
    <main>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 m-4">
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        {/*<select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="customer_all" >
                Alle Übungsleiter
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
        </select>*/}
      </div>
      <CardCollection sessionUserEmail={sessionUserEmail} />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
         {/*<RevenueChart revenue={revenue}  /> */}
         <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart sessionUserEmail={sessionUserEmail}/>
         </Suspense>
         {/*<LatestInvoices latestInvoices={latestInvoices} /> */}
         <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestInvoices sessionUserEmail={sessionUserEmail} />
         </Suspense>
      </div>
    </main>
  );
}

async function CardCollection({sessionUserEmail}:{sessionUserEmail: string;}){


  const {numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices} = await fetchCardData(sessionUserEmail);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Abgerechnet" value={totalPaidInvoices} type="collected" />
      <Card title="Ausstehend" value={totalPendingInvoices} type="pending" /> 
      <Card title="Anzahl Abrechnungen" value={numberOfInvoices} type="invoices" /> 
      <Card title="Anzahl Übungsleiter" value={numberOfCustomers}  type="customers"   /> 
    </div>
    )
}