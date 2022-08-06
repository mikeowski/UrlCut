import * as trpc from '@trpc/server'
import { resolve } from 'path'
import { z } from 'zod'
import { prisma } from '../../db/client'
import { createLinkValidator } from '../../shared/createLinkValidator'
export const LinkRouter = trpc
  .router()
  .query('getAllLinks', {
    async resolve() {
      const links = await prisma.shortLink.findMany()
      return links
    },
  })
  .query('getLinkByTag', {
    input: z.object({
      tag: z.string(),
    }),
    async resolve({ input }) {
      const link = await prisma.shortLink.findUnique({
        where: {
          tag: input.tag,
        },
      })
      if (!link) new Error('Link not found')
      return link
    },
  })
  .mutation('createLink', {
    input: createLinkValidator,
    async resolve({ input }) {
      return await prisma.shortLink.create({
        data: {
          tag: input.tag,
          url: input.url,
        },
      })
    },
  })
  .query('ısTagUnique', {
    input: z.object({
      tag: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma.shortLink.count({
        where: {
          tag: {
            equals: input.tag,
          },
        },
      })
      return count === 0
    },
  })
