'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { InvoicesTable } from '@/app/lib/definitions';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  groupId: z.string({
    invalid_type_error: 'Please select a group.',
  }),
  hours: z.coerce
    .number()
    .gt(0, { message: 'Please enter an hours greater than 0.' 
  }),
  dateId: z.coerce.date({
    invalid_type_error: 'Please enter a valid date.',
  }),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    hours?: string[];
    groupId?: string[];
    dateId?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    groupId: formData.get('groupId'),
    dateId: formData.get('dateId'),
    hours: formData.get('hours'),
  });

  //console.log(prevState.message)
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, groupId, hours, dateId} = validatedFields.data;
  //const amountInCents = amount * 100;
  //const date = new Date().toISOString().split('T')[0];
  const date = dateId.toISOString();
  const status = 'ausstehend';
    
  try {

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date, hours, groupId)
      SELECT
          ${customerId},
          ${hours} * s.rate,
          ${status},
          ${date},
          ${hours},
          ${groupId}
      FROM customers s
      WHERE s.id = ${customerId};
    `;

  } catch (error) {
    console.error('Databse Error: ', error,customerId, status, date, hours, groupId)
    return { message: 'Database Error: Failed to Insert Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}

export async function updateInvoice(id: string, prevState: State, formData: FormData,) {
  
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        groupId: formData.get('groupId'),
        dateId: formData.get('dateId'),
        hours: formData.get('hours'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }


    const { customerId, groupId, dateId, hours } = validatedFields.data;
    //const amountInCents = amount * 100;
    //const status = 'pending';

    const isoString = dateId.toISOString();
    //const formattedDate = isoString.split('T')[0];

    try {
        await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, groupid=${groupId}, hours=${hours}, amount=${hours} * s.rate, date=${isoString}
          FROM customers s
          WHERE invoices.customer_id = s.id
          AND invoices.id = ${id}
        `;
       
    } catch (error) {
        console.error('Databse Error: ', error,customerId, hours, groupId)
        return { message: 'Database Error: Failed to Update Invoice.' };
    }
    
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function deleteInvoice(id: string) {
    //throw new Error('Testing the Error Routine: Failed to Delete Invoice');
    
    try {
        
        await sql` DELETE FROM invoices WHERE id = ${id} `;
    
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Invoice.' };
    }
    revalidatePath('/dashboard/invoices');
   
   }


   export async function authenticate( prevState: string | undefined,  formData: FormData,  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }


  export async function approveInvoice(id: string, approveId: string) {
    //throw new Error('Testing the Error Routine: Failed to Delete Invoice');

    try {
        
        await sql` UPDATE invoices set status = ${approveId} WHERE id = ${id} `;
    
    } catch (error) {
        return { message: 'Database Error: Failed to Approve Invoice.' };
    }
    
    revalidatePath('/dashboard/invoices');
   
   }
