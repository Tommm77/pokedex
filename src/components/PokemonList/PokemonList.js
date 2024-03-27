import React, { useState } from 'react';
import usePokemonData from '../../hooks/usePokemonData';
import PokemonCard from '../PokemonCard/PokemonCard';

const PokemonList = () => {
  const { pokemons, loading } = usePokemonData();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les Pokémon en fonction du terme de recherche
  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div>
      <h1 className="text-4xl text-center my-8">Pokedex</h1>
      {/* Barre de recherche avec icône de loupe */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-2 border rounded w-96"
          />
          <div className="absolute top-0 left-0 mt-2 ml-3 text-gray-400">
            🔍
          </div>
        </div>
      </div>
      {/* Grille de cartes avec marges latérales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 mx-48">
        {filteredPokemons.map(pokemon => (
          <PokemonCard key={pokemon.pokedex_id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
