import Pagination from '@/app/ui/approvals/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/approvals/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPagesList } from '@/app/lib/data';
import { Metadata } from 'next';
import { auth } from '@/app/../auth';

export const metadata: Metadata = {
  title: 'Approvals',
};
 
//export default async function Page() {
export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {

    let session = await auth();
    const sessionUserEmail = session?.user?.email;
    const userEmail = ['steph@dietz.com', 'steven@tey.com','',''];

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchInvoicesPagesList(query, userEmail);

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
        <Table query={query} currentPage={currentPage} userEmail={userEmail}/>
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

import { auth, signOut } from '@/app/../auth';

export default async function Page() {
  let session = await auth();

  return (
    <div className="flex h-screen bg-white">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
        <p>You are logged in as {session?.user?.email}</p>
        <p>{session?.user?.name}</p>
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}*/