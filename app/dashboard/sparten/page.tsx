import { fetchSparten } from '@/app/lib/data';
import SpartenTable from '@/app/ui/sparten/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sparten',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const sparten = await fetchSparten(query);

  return (
    <main>
      <SpartenTable sparten={sparten} />
    </main>
  );
}