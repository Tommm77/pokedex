import React from 'react';
import { useLocation } from 'react-router-dom';

const PokemonDetails = () => {
  const location = useLocation();
  const { pokemon } = location.state || {};

  if (!pokemon) return <div>Aucun Pokémon sélectionné.</div>;

  return (
    <div>
      {/* Affichage des détails du Pokémon */}
      <h1>{pokemon.name.fr}</h1>
      {/* Autres détails du Pokémon */}
    </div>
  );
};

export default PokemonDetails;
