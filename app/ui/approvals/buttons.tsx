import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice, approveInvoice, fetchApprovalRole, fetchApprovalRank } from '@/app/lib/actions';
import { fetchRoleId } from '@/app/lib/data';
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

export async function ApproveInvoice({ id, invoices, sessionUserEmail }: { id: string, invoices: InvoicesTable[], sessionUserEmail: string | null | undefined }) {


  // get current state of the invoice: approved ? don't show the button : show the button
  const currentApproval = invoices.find(invoice => invoice.id === id)?.status || 'ausstehend';

  // if the currentApproval equals the approve state of the role, then don't show the button
  // currentApprovalRole === currentApproval
  const roleId = await fetchRoleId(sessionUserEmail);
  const currentApprovalRole = await fetchApprovalRole(roleId);

  // increase the state going from ausstehend to geprüft to genehmigt
  // state depends on the role of the current user
  // Übungsleiter can only increase from ausstehend to greprüft
  // Vorseitzender can only increase from geprüft to genehmigt
  const requestedApproval = await fetchApprovalRole(roleId);
  const requestedApprovalRank = await fetchApprovalRank(requestedApproval);
  const currentApprovalRank = await fetchApprovalRank(currentApproval);

  // jumping from ausstehend to genehmigt is not allowed
  // also moving the rank down is not allowed
  
  const enable = (currentApproval !== 'genehmigt') && (currentApproval !== currentApprovalRole) && (requestedApprovalRank > currentApprovalRank) && (Math.abs(Number(requestedApprovalRank)-Number(currentApprovalRank))===1);


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