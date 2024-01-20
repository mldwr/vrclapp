import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchFilteredSparten } from '@/app/lib/data';
import { auth } from '@/app/../auth';

import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
  let session = await auth();
  const authEmail = session?.user?.email ?? '';

  const id = params.id;
  const query = ''
  const [invoice, customers, groups] = await Promise.all([
      fetchInvoiceById(id),
      fetchCustomers(),
      fetchFilteredSparten(query),
    ]);
    
  if (!invoice) {
    notFound();
  }

  
  const filteredCustomers = customers.filter(customer => customer.email === authEmail);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abrechnungen', href: '/dashboard/invoices' },
          /* {
            label: 'Bearbeite Abrechnung',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          }, */
        ]}
      />
      <Form invoice={invoice} customers={filteredCustomers} groups={groups} />
    </main>
  );
}