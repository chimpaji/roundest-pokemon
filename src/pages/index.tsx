import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, secound] = ids;
  const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }]);
  const secoundPokemon = trpc.useQuery(['get-pokemon-by-id', { id: secound }]);
  if (firstPokemon.isLoading || secoundPokemon.isLoading)
    return <div>Loading....</div>;

  const voteForRoundest = (selected: number) => {};
  const btnClass =
    'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

  return (
    <div className='h-screen w-screen flex flex-col justify-center text-center items-center'>
      <div className='text-2xl'>Which Pokemon is the Roundest?</div>
      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        <div className='w-64 h-64 '>
          <img
            src={firstPokemon?.data?.sprites?.front_default || undefined}
            className='w-full'
            alt='pokemon-img'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>
            {firstPokemon?.data?.name}
          </div>
          <button className={btnClass} onClick={() => voteForRoundest(first)}>
            Rounder
          </button>
        </div>
        <div className='p-8'>vs</div>
        <div className='w-64 h-64 '>
          <img
            src={secoundPokemon?.data?.sprites?.front_default || undefined}
            className='w-full'
            alt='pokemon-img'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>
            {secoundPokemon?.data?.name}
          </div>
          <button className={btnClass} onClick={() => voteForRoundest(first)}>
            Rounder
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
