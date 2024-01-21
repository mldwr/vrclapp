import { sql } from '@vercel/postgres';
import {
  SpartenTable,
  CustomerField,
  CustomersTable,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchRevenue() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a reponse for demo purposes.
    // Don't do this in real life :)

    //console.log('Fetching revenue data...');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    //console.log('Data fetch complete after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    // REMOVE TODO 
    //await new Promise((resolve) => setTimeout(resolve, 5000));

    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({ ...invoice,  amount: formatCurrency(invoice.amount),  }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices( query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
       
    const invoices = await sql<InvoicesTable>`
    SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url,
        invoices.groupid
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;


    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}


export async function fetchFilteredInvoicesList( query: string, currentPage: number, emailList: string[]) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  //const emailList = ['steph@dietz.com', 'steven@tey.com','metin@gwv.de',''];

  try {
       
    const invoices = await sql<InvoicesTable>`
    SELECT
        invoices.id,
        invoices.amount,
        invoices.part,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url,
        invoices.groupid
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        (customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}) AND
        customers.email in (${emailList[0]}, ${emailList[1]},${emailList[2]}, ${emailList[3]})
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;


    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPagesList(query: string, emailList: string[]) {
  noStore();
  
  try {
    const count = await sql`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      (customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}) AND
      customers.email in (${emailList[0]}, ${emailList[1]},${emailList[2]}, ${emailList[3]})
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  
  try {
    const count = await sql`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}



export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
    SELECT
    invoices.id,
    invoices.customer_id,
    invoices.amount,
    invoices.part,
    invoices.date,
    invoices.status,
    invoices.groupid
  FROM invoices
      WHERE invoices.id = ${id};
    `;


    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      //amount: invoice.amount / 100,
      //date: new Date(invoice.date).toLocaleDateString()
    }));
    
    // console.log(invoice)
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchFilteredSparten( query: string) {
  noStore();
  try {
    const data = await sql<SpartenTable>`
      SELECT
        sp.name as spartenname,
        sl.name as spartenleiter,
        ul1.name as uebungsleiter_1,
        ul2.name as uebungsleiter_2,
        sp.spartenleiter as spartenleiterEmail,
        sp.uebungsleiter_1 as uebungsleiter_1Email,
        sp.uebungsleiter_2 as uebungsleiter_2Email
      FROM sparten sp
      left join users sl
      on sp.spartenleiter = sl.email
      left join users ul1
      on sp.uebungsleiter_1 = ul1.email
      left join users ul2
      on sp.uebungsleiter_2 = ul2.email
      WHERE
      sp.name ILIKE ${`%${query}%`} OR
      sl.name ILIKE ${`%${query}%`} OR
      ul1.name ILIKE ${`%${query}%`} OR
      ul2.name ILIKE ${`%${query}%`} OR
      sp.spartenleiter  ILIKE ${`%${query}%`} OR
      sp.uebungsleiter_1 ILIKE ${`%${query}%`} OR
      sp.uebungsleiter_2 ILIKE ${`%${query}%`} 
      ORDER BY sp.name ASC
    `;

    const groups = data.rows.length !== 0 ? data.rows : [{
      spartenname: '',
      spartenleiter: '',
      uebungsleiter_1: '',
      uebungsleiter_2: '',
      spartenleiteremail: '',
      uebungsleiter_1email:'', 
      uebungsleiter_2email: ''}] ;
    //const groups = data.rows;
    return groups;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch sparten table.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name,
        email
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const customers = await sql<CustomersTable>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'ausstehend' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'genehmigt' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    /* const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    })); */

    return customers.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`
    SELECT 
          id, 
          name, 
          email, 
          password, 
          role 
    from USERS 
          where email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export async function fetchRoleId(sessionUserEmail: string | null | undefined){
  noStore();

  try{
    const roleId = await sql<User>`
    SELECT
    role
    from USERS
    where email = ${sessionUserEmail}
    `;

    return roleId.rows[0].role;
  }catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch approveId.');
  }
}