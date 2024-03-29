import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FavAnimation.css'

const PokemonDetails = () => {
  const navigate = useNavigate();
  const getFilterClassName = (type) => `filter-${type}`;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { state } = useLocation();
  const { pokemon, pokemons, currentIndex } = state;

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(pokemon.pokedex_id));
  }, [pokemon.pokedex_id]);


  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(pokemon.pokedex_id)) {
      const filteredFavorites = favorites.filter(id => id !== pokemon.pokedex_id);
      localStorage.setItem('favorites', JSON.stringify(filteredFavorites));
      setIsFavorite(false);
    } else {
      setIsAnimating(true);
      localStorage.setItem('favorites', JSON.stringify([...favorites, pokemon.pokedex_id]));
      setIsFavorite(true);
    }
  };


const navigateToPokemon = (newIndex) => {
  const newPokemon = pokemons[newIndex];
  navigate(`/pokemon/${newPokemon.pokedex_id}`, {
    state: { pokemon: newPokemon, pokemons, currentIndex: newIndex },
  });
};

const handlePrevPokemon = () => {
  const newIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : pokemons.length - 1;
  navigateToPokemon(newIndex);
};

const handleNextPokemon = () => {
  const newIndex = (currentIndex + 1) % pokemons.length;
  navigateToPokemon(newIndex);
};


  const handleFight = () => {
    navigate(`/Fight/${pokemon.pokedex_id}`);
  };


  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };


  if (!pokemon) return <div>Aucun Pokémon sélectionné.</div>;


  // Définition des couleurs des types pour les barres de stats et les bordures des types
  const typeColors = {
    Normal: 'bg-gray-500',
    Plante: 'bg-green-500',
    Feu: 'bg-red-500',
    Eau: 'bg-blue-500',
    Électrik: 'bg-yellow-500',
    Glace: 'bg-cyan-500',
    Combat: 'bg-orange-500',
    Poison: 'bg-purple-500',
    Sol: 'bg-yellow-700',
    Vol: 'bg-blue-300',
    Psy: 'bg-pink-500',
    Insecte: 'bg-lime-500',
    Roche: 'bg-yellow-800',
    Spectre: 'bg-indigo-500',
    Dragon: 'bg-purple-700',
    Ténèbres: 'bg-gray-800',
    Acier: 'bg-gray-400',
    Fée: 'bg-pink-300',
  };

  const getBackgroundColor = (type) => typeColors[type] || 'bg-gray-200';
  const filterClassName = getFilterClassName(pokemon.types[0].name);
  const getStatWidth = (value) => `${(value / 130) * 100}%`;


  const handleBackToPokedex = () => {
    navigate("/Pokedex");
  };

  return (
    <div className="relative flex flex-col md:flex-row p-4 items-center justify-center">
  <button onClick={handleBackToPokedex} className={`absolute top-4 left-4 text-white px-4 py-2 rounded-xl shadow transition ease-in-out duration-150 ${getBackgroundColor(pokemon.types[0].name)} opacity-50 hover:opacity-100`}>
    ← Pokedex
  </button>
  <button onClick={handleFight} className={`absolute top-4 left-2 text-white px-4 py-2 rounded-xl shadow transition ease-in-out duration-150 ${getBackgroundColor(pokemon.types[0].name)} opacity-50 hover:opacity-100 ml-32`}>
    ⚔️ Combat
  </button>
  <button onClick={handlePrevPokemon} className={`absolute bottom-4 left-4 text-white px-4 py-2 rounded-xl shadow transition ease-in-out duration-150 ${getBackgroundColor(pokemon.types[0].name)} opacity-50 hover:opacity-100`}>
  ← Précédent
  </button>
  <button onClick={handleNextPokemon} className={`absolute bottom-4 right-4 text-white px-4 py-2 rounded-xl shadow transition ease-in-out duration-150 ${getBackgroundColor(pokemon.types[0].name)} opacity-50 hover:opacity-100`}>
    Suivant →
  </button>
  <div onClick={handleToggleFavorite} onAnimationEnd={handleAnimationEnd} className={`fav fav-star absolute top-4 right-4 ${isFavorite ? 'fav-star-favorite' : ''} ${isAnimating ? 'is-animating' : ''}`}>
  </div>


      <div className="flex-1 text-center mt-32">
      <div className="flex flex-col items-center">
  <h1 className="text-2xl font-bold mb-0">{pokemon.name.fr}</h1>
  <img src={pokemon.sprites.regular} alt={pokemon.name.fr} className="z-1 w-1/2 md:w-full lg:w-3/4 -mt-16 fdp" />
</div>
<div className="flex justify-center flex-wrap mt-2">
  {pokemon.types.map((type, index) => (
    <div key={index} className={`inline-flex items-center ${getBackgroundColor(type.name)} border border-gray-200 rounded-xl px-3 py-1 m-1`}>
      <img src={type.image} alt={type.name} className="w-6 h-6 mr-2" />
      <div className="text-white font-semibold">
        {type.name}
      </div>
    </div>
  ))}
</div>
</div>


      <div className="flex-1 mt-4 md:mt-36 md:ml-8">
    <h2 className="text-xl font-bold mb-4">Stats</h2>
    {Object.entries(pokemon.stats).map(([key, value]) => (
        <div key={key} className="mb-2 flex items-center">
            <span className="font-semibold capitalize w-32">{key.replace('_', ' ')}:</span>
            <span className="font-semibold w-12 text-center">{value}</span>
            <div className="flex-1 ml-4 bg-gray-200 rounded-xl h-6 overflow-hidden">
            <div className={`${getBackgroundColor(pokemon.types[0].name)} h-full rounded-xl`} style={{ width: getStatWidth(value) }}></div>
            </div>
        </div>
    ))}


<div className="mt-6">
  <h2 className="text-xl font-bold">Évolution</h2>
  <div className="mt-2 flex flex-wrap justify-center">
    {/* Affichage des évolutions précédentes, s'il y en a */}
    {pokemon.evolution?.pre && pokemon.evolution?.pre.map(ev => (
      <div key={ev.pokedex_id} className="text-center p-2 z-1">
        <img src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${ev.pokedex_id}/regular.png`} alt={ev.name} className="w-24 h-24 mx-auto" />
        <span>{ev.name}</span>
      </div>
    ))}
    {/* Affichage de l'évolution actuelle */}
    <div className="text-center p-2">
      <img src={pokemon.sprites.regular} alt={pokemon.name.fr} className="w-24 h-24 mx-auto" />
      <span>{pokemon.name.fr}</span>
    </div>
    {/* Affichage des évolutions suivantes, s'il y en a */}
    {pokemon.evolution?.next && pokemon.evolution?.next.map(ev => (
      <div key={ev.pokedex_id} className="text-center p-2">
        <img src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${ev.pokedex_id}/regular.png`} alt={ev.name} className="w-24 h-24 mx-auto" />
        <span>{ev.name}</span>
      </div>
    ))}
    {/* Affichage des méga-évolutions si disponibles */}
    {pokemon.evolution?.mega && pokemon.evolution?.mega.map(mega => (
      <div key={mega.orbe} className="text-center p-2">
        <img src={mega.sprites.regular} alt={`Mega ${pokemon.name.fr}`} className="w-24 h-24 mx-auto" />
        <span>Mega {pokemon.name.fr}</span>
      </div>
    ))}
  </div>
</div>






      </div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${filterClassName}`} style={{width: '51rem'}}>
        <img src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png"
             alt="Pokeball"
             className="w-full h-auto opacity-30"
        />
      </div>
    </div>

  );
};

export default PokemonDetails;
