import React from 'react';

const getTypeGradient = (types) => {
  if (!types || types.length === 0) return 'bg-gray-200';

  const type = types[0].name;
  const typeColors = {
    Normal: 'bg-gradient-to-b from-gray-300 to-gray-700',
    Plante: 'bg-gradient-to-b from-green-300 to-green-700',
    Feu: 'bg-gradient-to-b from-red-300 to-red-700',
    Eau: 'bg-gradient-to-b from-blue-300 to-blue-700',
    Électrik: 'bg-gradient-to-b from-yellow-300 to-yellow-700',
    Glace: 'bg-gradient-to-b from-cyan-300 to-cyan-700',
    Combat: 'bg-gradient-to-b from-orange-300 to-orange-700',
    Poison: 'bg-gradient-to-b from-purple-300 to-purple-700',
    Sol: 'bg-gradient-to-b from-yellow-700 to-yellow-700',
    Vol: 'bg-gradient-to-b from-blue-200 to-blue-300',
    Psy: 'bg-gradient-to-b from-pink-300 to-pink-700',
    Insecte: 'bg-gradient-to-b from-lime-300 to-lime-700',
    Roche: 'bg-gradient-to-b from-yellow-700 to-yellow-800',
    Spectre: 'bg-gradient-to-b from-indigo-300 to-indigo-700',
    Dragon: 'bg-gradient-to-b from-purple-700 to-purple-700',
    Ténèbres: 'bg-gradient-to-b from-gray-700 to-gray-800',
    Acier: 'bg-gradient-to-b from-gray-300 to-gray-700',
    Fée: 'bg-gradient-to-b from-pink-200 to-pink-300',
  };

  return typeColors[type] || 'bg-gradient-to-r from-grey-300 to-grey-700';
};

const PokemonCard = ({ pokemon }) => {
  const gradientClass = getTypeGradient(pokemon.types);

  return (
    <div className={`group rounded-xl overflow-hidden shadow-lg ${gradientClass} text-white p-4 m-2 flex flex-col justify-between transform transition duration-100 hover:scale-110 relative`}>
      <div className="absolute top-2 right-2 flex space-x-1">
        {pokemon.types?.map((type, index) => (
          <img key={index} src={type.image} alt={type.name} className="w-6 h-6" />
        ))}
      </div>
      <img src={pokemon.sprites.regular} alt={`Image de ${pokemon.name.fr}`} className="w-32 h-32 self-center" />
      <div className="flex justify-between w-full mt-4">
        <div className="text-xl font-bold">#{pokemon.pokedex_id}</div>
        <div className="text-lg">{pokemon.name.fr}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
