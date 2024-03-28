import React from 'react';
import { Link } from 'react-router-dom';

const getTypeGradient = (types) => {
  if (!types || types.length === 0) return 'bg-gray-200';

  const type = types[0].name;
  const typeColors = {
    Normal: 'from-gray-300 to-gray-700',
    Plante: 'from-green-300 to-green-700',
    Feu: 'from-red-300 to-red-700',
    Eau: 'from-blue-300 to-blue-700',
    Électrik: 'from-yellow-300 to-yellow-700',
    Glace: 'from-cyan-300 to-cyan-700',
    Combat: 'from-orange-300 to-orange-700',
    Poison: 'from-purple-300 to-purple-700',
    Sol: 'from-yellow-700 to-yellow-900',
    Vol: 'from-blue-200 to-blue-600',
    Psy: 'from-pink-300 to-pink-700',
    Insecte: 'from-lime-300 to-lime-700',
    Roche: 'from-yellow-500 to-yellow-900',
    Spectre: 'from-indigo-300 to-indigo-700',
    Dragon: 'from-purple-700 to-purple-900',
    Ténèbres: 'from-gray-700 to-gray-900',
    Acier: 'from-gray-300 to-gray-700',
    Fée: 'from-pink-200 to-pink-500',
  };

  return typeColors[type] || 'bg-gradient-to-r from-grey-300 to-grey-700';
};

const PokemonCard = ({ pokemon }) => {
  const gradientClass = getTypeGradient(pokemon.types);

  return (
    <Link to={`/pokemon/${pokemon.pokedex_id}`} state={{ pokemon }}>
    <div className={`group rounded-xl overflow-hidden shadow-lg bg-gradient-to-b ${gradientClass} text-white p-4 m-2 flex flex-col justify-between transform transition duration-100 hover:scale-110 relative`}>
      <div className="absolute top-2 right-2 flex space-x-1">
        {pokemon.types?.map((type, index) => (
          <img key={index} src={type.image} alt={type.name} className="w-6 h-6 rounded-lg" />
        ))}
      </div>
      <img src={pokemon.sprites.regular} alt={`Image de ${pokemon.name.fr}`} className="w-32 h-32 self-center" />
      <div className="flex justify-between w-full mt-4">
        <div className="text-xl font-bold">#{pokemon.pokedex_id}</div>
        <div className="text-lg">{pokemon.name.fr}</div>
      </div>
    </div>
    </Link>
  );
};

export default PokemonCard;
