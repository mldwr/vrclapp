import { fetchFilteredCustomers, fetchFilteredCustomersSparten,fetchFilteredCustomersUser, fetchSparten } from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';
import { Metadata } from 'next';
import { auth } from '@/app/../auth';

export const metadata: Metadata = {
  title: 'Customers',
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

  const sparten = await fetchSparten(sessionUserEmail)
  const sparte = sparten[0].spartenname
  // if user is Spartenleiter, then he shall see all Uebungsleiter via the Sparten table
  // if user is Uebungsleiter, then he shall see only himself
  // if user is Vorsitzender, then he shall see all Uebungsleiter

  const query = searchParams?.query || '';

  let customers;
  if(sessionUserRole === 'Vorsitzender'){
    customers = await fetchFilteredCustomers(query)
  }else if(sessionUserRole === 'Uebungsleiter') {
    customers = await fetchFilteredCustomersUser(query,sessionUserEmail);
  }else {
    customers = await fetchFilteredCustomersSparten(query,sparte)
  }
  

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}