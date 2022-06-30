import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import { inferQueryResponse } from './api/trpc/[trpc]';

const btnClass =
  'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, secound] = ids;
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secoundPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secound }]);

  const voteMutation = trpc.useMutation(['cast-vote']);

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: secound });
    } else {
      voteMutation.mutate({ votedFor: secound, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };
  if (firstPokemon.isLoading || secoundPokemon.isLoading)
    return <div>Loading....</div>;

  return (
    <div className='h-screen w-screen flex flex-col justify-center text-center items-center'>
      <div className='text-2xl'>Which Pokemon is the Rounder?</div>
      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secoundPokemon.isLoading &&
          secoundPokemon.data && (
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
          )}
      </div>
      <a
        className='fixed bottom-0'
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
    <div className=''>
      <Image
        src={props.pokemon.sprites?.front_default as string}
        width={256}
        height={256}
        layout='fixed'
        alt='pokemon-img'
      />
      <div className='text-xl text-center capitalize mt-[-2rem]'>
        {props.pokemon.name}
      </div>
      <button className={btnClass} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
