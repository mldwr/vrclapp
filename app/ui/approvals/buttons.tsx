import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { 
  deleteInvoice, 
  approveInvoice
} from '@/app/lib/actions';
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

export async function ApproveInvoice(
{ 
  id, 
  invoices, 
  sparteUser,
  sessionUserRole
}: { 
  id: string, 
  invoices: InvoicesTable[], 
  sparteUser: string,
  sessionUserRole: string
}
  ) {


  // get current state of the invoice: approved ? don't show the button : show the button
  const currentApproval = invoices.find(invoice => invoice.id === id)?.status || '';
  // get the current division (sparte)
  const currentSparte = invoices.find(invoice => invoice.id === id)?.groupid || '';


  // approval can move from status 'ausstehend' to 'geprüft' to 'genehmigt'
  const aprovals: {[key: string]: string} = {
    'ausstehend': 'geprüft',
    'geprüft': 'genehmigt',
  };
  const requestedApproval = aprovals[currentApproval];

  // if user has the role 'Vorstand' then check also if the user has the role 'Spartenleiter'
  const enableL1 = (currentApproval === 'ausstehend') && (currentSparte === sparteUser)
  const enableL2 = (currentApproval === 'geprüft') && (sessionUserRole === 'Vorsitzender')
  const enableL3 = (currentApproval !== 'genehmigt')
  const enable = enableL3 && (enableL1 || enableL2)

  if(enable){

    const approveInvoiceWithId = approveInvoice.bind(null, id, requestedApproval);

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