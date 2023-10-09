import { privateProcedure, publicProcedure, router } from './trpc';

import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

//main router, define all the api endpoints
export const appRouter = router({
  //   test: publicProcedure.query(() => {
  //     return 3;
  //   }),
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if (!user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

    // check if the user is in  the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      // create user if not in database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),

  // new api endpoint, as the name status we pass in a user ID and we get back all files of this user owned
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

//publicProcedure create query or mutation, queries are mainly for get requests so purely getting data, and mutations are for post patch and delete requests, for modifying data
//depend on return data type, check auth-callback/page.tsx would return the data in same data type
