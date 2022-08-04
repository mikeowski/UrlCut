import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import superjson from 'superjson';
import { LinkRouter } from './link';
export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('link.', LinkRouter);
// export type definition of API
