import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { inferQueryResponse } from './api/trpc/[trpc]';

const btnClass =
  'inline-flex items-center justify-center text-center p-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, secound] = ids;
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secoundPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secound }]);

  const voteMutation = trpc.useMutation(['cast-vote']);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      console.log({ votedForId: first, votedAgainstId: secound });

      voteMutation.mutate({ votedForId: first, votedAgainstId: secound });
    } else {
      console.log({ votedForId: secound, votedAgainstId: first });

      voteMutation.mutate({ votedForId: secound, votedAgainstId: first });
    }
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secoundPokemon.isLoading &&
    secoundPokemon.data;
  // const dataLoaded = false;

  return (
    <div className='h-screen w-screen flex flex-col justify-between  items-center'>
      <div className='text-2xl pt-8'>Which Pokemon is the Rounder?</div>
      {!dataLoaded && (
        <div className='flex justify-center items-center'>
          <img src='/rings.svg' alt='loading-icon' />
        </div>
      )}
      {dataLoaded && (
        <div className='border rounded p-8 flex justify-between items-center'>
          <>
            <PokemonListing
              pokemon={firstPokemon.data}
              vote={() => voteForRoundest(first)}
            />
            <div className='p-8'>vs</div>
            <PokemonListing
              pokemon={secoundPokemon.data}
              vote={() => voteForRoundest(secound)}
            />
          </>
        </div>
      )}
      <Link href='/results'>
        <div className='fixed bottom-8 right-8 rounded border bg-purple-600 p-2 cursor-pointer'>
          Go to Score Board
        </div>
      </Link>
      <a
        className=''
        target='_blank'
        rel='noreferrer'
        href='https://github.com/chimpaji/roundest-pokemon'
      >
        Github
      </a>
    </div>
  );
};

export default Home;

type PokemonFromServer = inferQueryResponse<'get-pokemon-by-id'>;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className='flex flex-col'>
      <Image
        src={props.pokemon?.spriteUrl as string}
        width={100}
        height={100}
        layout='intrinsic'
        alt='pokemon-img'
      />
      <div className='text-xl text-center capitalize mt-1'>
        {props?.pokemon?.name}
      </div>
      <button className={btnClass} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
