import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { SpartenTable } from '@/app/lib/definitions';

export default async function SpartenTable({
  sparten,
}: {
  sparten: SpartenTable[];
}) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>        Sparten      </h1> 
      <Search placeholder="Suche Trainer..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {sparten?.map((sparte) => (
                  <div
                    key={sparte.spartenname}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>{sparte.spartenname}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {sparte.spartenleiter}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Ausstehend</p>
                        <p className="font-medium">{sparte.uebungsleiter_1}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Genehmigt</p>
                        <p className="font-medium">{sparte.uebungsleiter_2}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Spartenname
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Spartenleiter
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Übungsleiter 1
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                    Übungsleiter 2
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {sparten.map((sparte) => (
                    <tr key={sparte.spartenname} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{sparte.spartenname}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {sparte.spartenleiter}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {sparte.uebungsleiter_1}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {sparte.uebungsleiter_2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
