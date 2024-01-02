//use it in server components, not client

import Dashboard from '@/components/Dashboard';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!dbUser) redirect('/auth-callback?origin=dashboard');
  return <Dashboard />;
  //return <div>{user.email}</div>;
};
export default Page;
