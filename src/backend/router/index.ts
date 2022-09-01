import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { LinkRouter } from './link'
export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('link.', LinkRouter)
// export type definition of API
