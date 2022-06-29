const MAX_DEX_ID = 493;

export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne?: number
) => {
  //notThisOne will be used for the secound pokemon that will be used to compare
  const pokeDexNumber = Math.floor(Math.random() * (MAX_DEX_ID - 1));

  if (pokeDexNumber !== notThisOne) return pokeDexNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomPokemon();
  const secoundId = getRandomPokemon(firstId);

  return [firstId, secoundId];
};
