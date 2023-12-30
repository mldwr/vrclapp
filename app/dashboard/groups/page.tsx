/* export default function Page() {
    return <p>Groups Page</p>;
}  */

import { auth, signOut } from '@/app/../auth';

export default async function Page() {
  let session = await auth();

  return (
    <div className="flex h-screen bg-white">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-black">
        <p>You are logged in as {session?.user?.email}</p>
        <p>{session?.user?.name}</p>
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}