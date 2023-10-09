import { TRPCError, initTRPC } from '@trpc/server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();
const middleware = t.middleware;

//create a middleware to check if the user is authenticated
//callback function
const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth); // means when someone calls this procedure, then it makes sure to run through this middleware beforehand to ensure whatever bussiness logic is run before the API endpoint is called ('getUserFiles' from index.ts)
