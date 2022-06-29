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
  if (firstPokemon.isLoading || secoundPokemon.isLoading)
    return <div>Loading....</div>;

  const voteForRoundest = (selected: number) => {};

  return (
    <div className='h-screen w-screen flex flex-col justify-center text-center items-center'>
      <div className='text-2xl'>Which Pokemon is the Roundest?</div>
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
      <img
        src={props.pokemon.sprites?.front_default || undefined}
        className='w-full w-64 h-64 '
        alt='pokemon-img'
      />
      <div className='text-xl text-center capitalize mt-[-2rem]'>
        {props.pokemon.name}
      </div>
      <button className={btnClass} onClick={() => props.vote}>
        Rounder
      </button>
    </div>
  );
};
