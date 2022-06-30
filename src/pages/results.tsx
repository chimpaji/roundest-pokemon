import React from 'react';
import { prisma } from '@/backend/utils/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { inferQueryResponse } from './api/trpc/[trpc]';
import { AsyncReturnType } from '@/utils/ts-bs';

type PokemonWithVoteQueryResult = AsyncReturnType<typeof getPokemonVotes>;

const calcWinRate = (pokeVote: PokemonWithVoteQueryResult[number]) =>
  ((pokeVote._count.votedFor * 100) /
    (pokeVote._count.votedFor + pokeVote._count.votedAgainst)) |
  0;

const ResultsPage: React.FC<{ pokeVotes: PokemonWithVoteQueryResult }> = ({
  pokeVotes,
}) => {
  return (
    <div>
      <div className='text-4xl text-center pt-8'>WinRate Board</div>
      <div className='text-xl text-center pb-6'>
        Go vote for more accuracy! ;P
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 md:p-6'>
        {pokeVotes?.map((pv) => (
          <div
            key={pv.id}
            className='grid-items flex border justify-center items-center'
          >
            <Image
              src={pv.spriteUrl}
              width={150}
              height={150}
              layout='fixed'
              className='w-1/2'
              alt='pokemon-img'
            />
            <div className='w-1/2'>
              <div>{pv.name}</div>
              <div>
                <div>{calcWinRate(pv)}%</div>
                <div className='w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700'>
                  <div
                    className='bg-gray-600 h-1.5 rounded-full dark:bg-gray-300'
                    style={{ width: `${calcWinRate(pv)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href='/'>
        <div className='fixed bottom-8 right-8 rounded border bg-purple-600 p-2 cursor-pointer'>
          Back to home page
        </div>
      </Link>
    </div>
  );
};

const getPokemonVotes = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      votedFor: {
        _count: 'desc',
      },
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          votedFor: true,
          votedAgainst: true,
        },
      },
    },
  });
};

export async function getStaticProps() {
  const pokeVotes = await getPokemonVotes();

  return {
    props: {
      pokeVotes,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 600, // In seconds
  };
}

export default ResultsPage;
