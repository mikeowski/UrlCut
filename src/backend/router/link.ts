import * as trpc from '@trpc/server';
import { resolve } from 'path';
import { z } from 'zod';
import { prisma } from '../../db/client';
export const LinkRouter = trpc
  .router()
  .query('getAllLinks', {
    async resolve() {
      const links = await prisma.shortLink.findMany();
      return links;
    }
  })
  .query('getLinkByTag', {
    input: z.object({
      tag: z.string()
    }),
    async resolve({ input }) {
      const link = await prisma.shortLink.findUnique({
        where: {
          tag: input.tag
        }
      });
      if (!link) new Error('Link not found');
      return link;
    }
  });
