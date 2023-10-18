import { NextRequest } from 'next/server';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const { id: userId } = user;
  if (!userId) return new Response('Unauthorized', { status: 401 });
  //body contents are validated against the schema, schema validation library, zod, makes sure that we always have data. Create a validator for each endpoint.
  const { fileId, message } = SendMessageValidator.parse(body);
  // find file in db
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });
  if (!file) return new Response('Not found', { status: 404 });
  // if file found, create message, do db
  await db.message.create();
};
