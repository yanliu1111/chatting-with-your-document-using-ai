import { useRouter, useSearchParams } from 'next/navigation';

//this page is for sync the login user, and make sure they are also in db
const Page = async () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get('origin'); // origin = dashboard

  const apiResponse = await fetch('/api/auth-callback', {});
};

export default Page;
