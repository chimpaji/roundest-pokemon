import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@/backend/utils/prisma';
export const appRouter = trpc
  .router()
  .query('get-pokemon-by-id', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: input.id },
      });

      if (!pokemon) throw new Error('lol doesnt exist');

      return pokemon;
    },
  })
  .mutation('cast-vote', {
    input: z.object({
      votedForId: z.number(),
      votedAgainstId: z.number(),
    }),
    async resolve({ input }) {
      console.log('input', input);

      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedForId,
          votedAgainstId: input.votedAgainstId,
        },
      });

      return { success: true, vote: voteInDb };
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;
