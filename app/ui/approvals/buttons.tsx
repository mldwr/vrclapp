import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, approveInvoice } from '@/app/lib/actions';
import { InvoicesTable } from '@/app/lib/definitions';


export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function ApproveInvoice({ id, invoices, sessionUserEmail }: { id: string, invoices: InvoicesTable[], sessionUserEmail: string | null | undefined }) {


  // get current state of the invoice: approved ? don't show the button : show the button
  const currentApproval = invoices.find(invoice => invoice.id === id)?.status || 'ausstehend';

  if(currentApproval !== 'genehmigt'){

    const approveInvoiceWithId = approveInvoice.bind(null, id, currentApproval, sessionUserEmail);

    return (
      <form action={approveInvoiceWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Approve</span>
          <CheckCircleIcon className="w-5" />
        </button>
      </form>
    );
  }
}