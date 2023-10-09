//use it in server components, not client

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  // check user login
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');
  const dbUser = await db.user.findFirst({ where: { id: user.id } });
  // check user sync in db
  if (!dbUser) redirect('/auth-callback?origin=dashboard');
  return <Dashboard />;
};
export default Page;
