import Pagination from '@/app/ui/approvals/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/approvals/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { 
  fetchInvoicesApprovePagesSparte, 
  fetchInvoicesApprovePagesUser, 
  fetchInvoicesPages, 
  fetchSparten,
  fetchInvoicesApproveListSparte,
  fetchInvoicesApproveList
} from '@/app/lib/data';
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
    const sessionUserRole = session?.user?.image ?? ''; 

    // if role is Vorsitzender, get all invoices, that have the status 'geprüft'
    // if role is Spartenleiter, get all invoices, from correspoinding Sparte and invoice status 'ausstehend'

    const sparten = await fetchSparten(sessionUserEmail)
    const sparteUser = sparten[0].spartenname

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    //const totalPages = await fetchApprovalsPagesList(query, sparte);

    let totalPages = 0;
    let invoices;
    if(sessionUserRole === 'Vorsitzender'){
      totalPages = await fetchInvoicesPages(query);
      invoices = await fetchInvoicesApproveList(query, currentPage);
    }else if(sessionUserRole === 'Uebungsleiter') {
      totalPages = await fetchInvoicesApprovePagesUser(query,sessionUserEmail);
    }else {
      totalPages = await fetchInvoicesApprovePagesSparte(query,sparteUser);
      invoices = await fetchInvoicesApproveListSparte(query, currentPage, sparteUser);
    }

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
        <Table invoices={invoices} sparteUser={sparteUser} sessionUserRole={sessionUserRole}/>
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