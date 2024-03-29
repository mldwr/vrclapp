'use client';

import { CustomerField, InvoiceForm, SpartenTable } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ArrowPathRoundedSquareIcon,
  UsersIcon,
  UserPlusIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice } from '@/app/lib/actions';
import { useFormState, useFormStatus } from 'react-dom';

export default function EditInvoiceForm({  invoice,  customers, groups, }: {  invoice: InvoiceForm;  customers: CustomerField[]; groups: SpartenTable[],}) {

  const initialState = { message: null, errors: {} };  
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, dispatch] = useFormState(updateInvoiceWithId, initialState);
  
  const gmtDate = new Date(invoice.date);
  const year = gmtDate.getFullYear();
  const month= gmtDate.getMonth();
  const day = gmtDate.getDate();
  const formattedDate = new Date(Date.UTC(year,month,day)).toISOString().split('T')[0];

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Trainer Name  
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customer_id}
              aria-describedby="customer-error"
            >
              {/* <option value="" disabled>
                Select a customer
              </option> */}
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Group Name */}
        <div className="mb-4">
          <label htmlFor="group" className="mb-2 block text-sm font-medium">
            Gruppenname
          </label>
          <div className="relative">
            <select
              name="groupId"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.groupid}
              aria-describedby="group-error"
            >
              <option value="" disabled>
                Wähle eine Gruppe
              </option>
              {groups.map((group) => (
                <option key={group.spartenname} value={group.spartenname}>
                  {group.spartenname}
                </option>
              ))}
            </select>
            <UsersIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="group-error" aria-live="polite" aria-atomic="true">
            {state.errors?.groupId &&
              state.errors.groupId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Invoice Date */}
        <div className="mb-4">
          <label htmlFor="dateId" className="mb-2 block text-sm font-medium">
            Datum der Teilnahme
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="dateId"
                name="dateId"
                type="date"
                placeholder="Wähle ein Datum"
                defaultValue={formattedDate}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="invoice-error"
              />
              <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="invoice-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dateId && state.errors.dateId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* Number of hours */}
        <div className="mb-4">
          <label htmlFor="hours" className="mb-2 block text-sm font-medium">
            Anzahl Stunden
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="hours"
                name="hours"
                type="number"
                step="1"
                placeholder="Wähle eine Anzahl"
                defaultValue={invoice.hours}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="hours-error"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="hours-error" aria-live="polite" aria-atomic="true">
              {state.errors?.hours && state.errors.hours.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Invoice Number of Hours */}
        {/* <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Anzahl Stunden
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                defaultValue={invoice.amount}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="invoice-error"
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="invoice-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount && state.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>*/}


        {/* Invoice Status */}
        {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="ausstehend"
                  name="status"
                  type="radio"
                  value="ausstehend"
                  defaultChecked={invoice.status === 'ausstehend'}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                />
                <label
                  htmlFor="ausstehend"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  Ausstehend <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="geprüft"
                  name="status"
                  type="radio"
                  value="geprüft"
                  defaultChecked={invoice.status === 'geprüft'}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                />
                <label
                  htmlFor="geprüft"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-300"
                >
                  Geprüft <ArrowPathRoundedSquareIcon className="ml-1 w-4 text-brown" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="genehmigt"
                  name="status"
                  type="radio"
                  value="genehmigt"
                  defaultChecked={invoice.status === 'genehmigt'}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                />
                <label
                  htmlFor="genehmigt"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white dark:text-gray-300"
                >
                  Genehmigt <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset> */}
        

        <div aria-live="polite" aria-atomic="true">
          {state.message? (
              <p className="mt-2 text-sm text-red-500">
                {state.message}
              </p>
            ): null}
        </div>
        
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Abbrechen
        </Link>
        {/*<Button type="submit" >Bearbeite Abrechnung</Button>*/}
        <UpdateInvoiceButton />
      </div>
    </form>
  );
}


function UpdateInvoiceButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button aria-disabled={pending} disabled={pending}>
      Bearbeite Abrechnung 
    </Button>
  );
}