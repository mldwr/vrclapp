import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchGroups } from '@/app/lib/data';
import { auth } from '@/app/../auth';
 
export default async function Page() {
  let session = await auth();
  const authEmail = session?.user?.email ?? '';

  const customers = await fetchCustomers();
  const groups = await fetchGroups();

  const filteredCustomers = customers.filter(customer => customer.email === authEmail);
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abrechnungen', 
            href: '/dashboard/invoices' 
          },
          /* {
            label: 'Erstelle Abrechnung',
            href: '/dashboard/invoices/create',
            active: true,
          }, */
        ]}
      />
      <Form customers={filteredCustomers} groups={groups}/>
    </main>
  );
}