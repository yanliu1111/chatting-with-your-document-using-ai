'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';
import { trpc } from '../_trpc/client';

//this page is for sync the login user, and make sure they are also in db
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin'); // origin = dashboard
  //use frontend authcallback api
  // run for page load, we don't need to call anywhere or invoke it. This automatically run once the page is loaded and displayed to the user
  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        // user is synced to db
        router.push(origin ? `/${origin}` : '/dashboard');
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in');
      }
    },
    retry: true,
    retryDelay: 500,
  });
  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='animate-spin w-8 h-8 text-zinc-800' />
        <h3 className='font-semibold text-xl'>Setting up your account ...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
//depend on trpc/index.ts return data type, check auth-callback/page.tsx would return the data in same data type
