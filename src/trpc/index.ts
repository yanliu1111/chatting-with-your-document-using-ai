import { privateProcedure, publicProcedure, router } from './trpc';

import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { z } from 'zod';

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
  //z.object is a type checker, a certen schema, if the input doesnt match the schema, then it will throw an error. key is important for checking the input
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      }); //find the first file that matches the key
      if (!file)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        });
      return file;
    }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!file)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'File not found',
        });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });
      return file;
    }), //force type at runtime, if dont pass in id that exactly matches this type, then API route will throw an error
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

//publicProcedure create query or mutation, queries are mainly for get requests so purely getting data, and mutations are for post patch and delete requests, for modifying data
//depend on return data type, check auth-callback/page.tsx would return the data in same data type
