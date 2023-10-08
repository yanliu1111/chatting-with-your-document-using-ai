import { useRouter, useSearchParams } from 'next/navigation';

import { trpc } from '../_trpc/client';

//this page is for sync the login user, and make sure they are also in db
const Page = async () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin'); // origin = dashboard

  const { data, isLoading } = trpc.test.useQuery();
};

export default Page;
//depend on trpc/index.ts return data type, check auth-callback/page.tsx would return the data in same data type
