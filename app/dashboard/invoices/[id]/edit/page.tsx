import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers, fetchGroups } from '@/app/lib/data';
import { auth } from '@/app/../auth';

import { notFound } from 'next/navigation';
 
export default async function Page({ params }: { params: { id: string } }) {
  let session = await auth();
  const authEmail = session?.user?.email ?? '';

  const id = params.id;
  const [invoice, customers, groups] = await Promise.all([
      fetchInvoiceById(id),
      fetchCustomers(),
      fetchGroups(),
    ]);
    
  if (!invoice) {
    notFound();
  }

  console.log('invoice: ',invoice)
  
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