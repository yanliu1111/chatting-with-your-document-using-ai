import { notFound, redirect } from 'next/navigation';

import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  //retrieve the file id
  const { fileid } = params;
  //make database call
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`);
  //make database call
  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id, //only allow user to access their own files
    },
  });
  if (!file) notFound(); //if file not found, return 404
  return <div>{fileid}</div>;
};

export default Page;
