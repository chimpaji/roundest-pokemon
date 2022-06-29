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
  if (firstPokemon.isLoading) return <div>Loading....</div>;

  return (
    <div className='h-screen w-screen flex flex-col justify-center text-center items-center'>
      <div className='text-2xl'>Which Pokemon is the Roundest?</div>
      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        <div className='w-64 h-64 '>
          <img
            src={firstPokemon?.data?.sprites.front_default}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>
            {firstPokemon?.data?.name}
          </div>
        </div>
        <div className='p-8'>vs</div>
        <div className='w-64 h-64 '>
          <img
            src={secoundPokemon?.data?.sprites.front_default}
            className='w-full'
          />
          <div className='text-xl text-center capitalize mt-[-2rem]'>
            {secoundPokemon?.data?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
