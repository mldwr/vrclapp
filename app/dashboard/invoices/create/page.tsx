import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchGroups } from '@/app/lib/data';
import { auth } from '@/app/../auth';
 
export default async function Page() {
  let session = await auth();
  const authName = session?.user?.name || 'na';

  const customers = await fetchCustomers();
  const groups = await fetchGroups();

  const filteredCustomers = customers.filter(customer => customer.name === authName);
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abrechnungen', 
            href: '/dashboard/invoices' 
          },
          {
            label: 'Erstelle Abrechnung',
            href: '/dashboard/invoices/create',
            active: true,
          },
          {
            label: authName,
            href: '/dashboard/invoices',
          },
        ]}
      />
      <Form customers={filteredCustomers} groups={groups}/>
    </main>
  );
}