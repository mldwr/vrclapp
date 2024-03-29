import { CheckIcon, ClockIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'ausstehend',
          'bg-orange-100 text-orange-500': status === 'geprüft',
          'bg-green-500 text-white': status === 'genehmigt',
        },
      )}
    >
      {status === 'ausstehend' ? (
        <>
          Ausstehend
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'geprüft' ? (
        <>
          Geprüft
          <ArrowPathRoundedSquareIcon className="ml-1 w-4 text-brown" />
        </>
      ) : null}
      {status === 'genehmigt' ? (
        <>
          Genehmigt
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
