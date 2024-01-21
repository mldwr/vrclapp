import Pagination from '@/app/ui/approvals/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/approvals/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPagesList, fetchFilteredSparten } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/app/../auth';

export const metadata: Metadata = {
  title: 'Approvals',
};
 
export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {

    let session = await auth();
    const sessionUserEmail = session?.user?.email ?? ''; 

    // if role is Vorsitzender, get all invoices, that have the status 'geprüft'
    // if role is Spartenleiter, get all invoices, from correspoinding Sparte and invoice status 'ausstehend'
    
    // if the user has the role Vorsietzender, then he must see all invoices
    const sparten = await fetchFilteredSparten(sessionUserEmail)

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchInvoicesPagesList(query, sessionUserEmail);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          Freigaben
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Suche Abrechnungen..." />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} sessionUserEmail={sessionUserEmail}/>
      </Suspense> 
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

/* export default function Page() {
    return <p>Groups Page</p>;
}  

}*/