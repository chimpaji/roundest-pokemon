import { PokemonClient } from 'pokenode-ts';
import { prisma } from '../src/backend/utils/prisma';
const doBackfill = async () => {
  const pokeApi = new PokemonClient();

  const allPokemon = await pokeApi.listPokemons(0, 493);

  const formattedPokemon = allPokemon.results.map((p, i) => ({
    id: i,
    name: p.name,
    spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      i + 1
    }.png`,
  }));
  const creation = await prisma.pokemon.createMany({
    data: formattedPokemon,
  });
};

doBackfill();

//{id name spriteUrl}
