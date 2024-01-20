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
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than 0.' 
  }),
  part: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than 0.' 
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
    amount?: string[];
    part?: string[];
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
    amount: formData.get('amount'),
    part: formData.get('part'),
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
  const { customerId, groupId, amount, part, dateId} = validatedFields.data;
  //const amountInCents = amount * 100;
  //const date = new Date().toISOString().split('T')[0];
  const date = dateId.toISOString();
  const status = 'ausstehend';
    
  try {

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date, part, groupId)
    VALUES (${customerId}, ${amount}, ${status}, ${date}, ${part}, ${groupId})
    `;

  } catch (error) {
    console.error('Databse Error: ', error,customerId, amount, status, date, part, groupId)
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
        amount: formData.get('amount'),
        part: formData.get('part'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }


    const { customerId, groupId, dateId, amount, part } = validatedFields.data;
    //const amountInCents = amount * 100;
    //const status = 'pending';

    const isoString = dateId.toISOString();
    //const formattedDate = isoString.split('T')[0];

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amount}, groupid=${groupId}, part=${part}, date=${isoString}
        WHERE id = ${id}
        `;
       
    } catch (error) {
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


  export async function approveInvoice(id: string, currentApproval: string, roleId: string) {
    //throw new Error('Testing the Error Routine: Failed to Delete Invoice');

    const approveId = await fetchApproveId(roleId, currentApproval);

    if(currentApproval !== approveId){
      try {
          
          await sql` UPDATE invoices set status = ${approveId} WHERE id = ${id} `;
      
      } catch (error) {
          return { message: 'Database Error: Failed to Approve Invoice.' };
      }

    }
    
    revalidatePath('/dashboard/invoices');
   
   }




  // increase the state going from ausstehend to geprüft to genehmigt
  // state depends on the role of the current user
  // Übungsleiter can only increase from ausstehend to greprüft
  // Vorseitzender can only increase from geprüft to genehmigt
export async function fetchApproveId(roleId: string, currentApproval: string){

  const aprovalsRank: {[key: string]: string} = {
    'ausstehend': '1',
    'geprüft': '2',
    'genehmigt': '3',
  };

  const requestedApproval = await fetchApprovalRole(roleId);
  const requestedApprovalRank = aprovalsRank[requestedApproval]
  const currentApprovalRank = aprovalsRank[currentApproval]

  // jumping from ausstehend to genehmigt is not allowed
  // also moving the rank down is not allowed
  if(requestedApprovalRank > currentApprovalRank && Math.abs(Number(requestedApprovalRank)-Number(currentApprovalRank))===1){
      return requestedApproval
  }

  return currentApproval

}

export async function fetchApprovalRole(roleId: string){

  const aprovalsRole: {[key: string]: string} = {
    'Spartenleiter': 'geprüft',
    'Vorsitzender': 'genehmigt',
  };

  const currentApprovalRole = aprovalsRole[roleId];

  return currentApprovalRole

}
