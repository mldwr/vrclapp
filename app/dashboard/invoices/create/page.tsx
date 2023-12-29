import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchGroups } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
  const groups = await fetchGroups();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Abrechnungen', href: '/dashboard/invoices' },
          {
            label: 'Erstelle Abrechnung',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} groups={groups}/>
    </main>
  );
}