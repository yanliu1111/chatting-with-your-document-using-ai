import { publicProcedure, router } from './trpc';

export const appRouter = router({
  test: publicProcedure.query(() => {
    return 3;
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

//publicProcedure create query or mutation, queries are mainly for get requests so purely getting data, and mutations are for post patch and delete requests, for modifying data
//depend on return data type, check auth-callback/page.tsx would return the data in same data type
