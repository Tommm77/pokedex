import React, { useState, useEffect } from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';

const PokemonList = ({pokemons}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectType, setSelectType] = useState('all');
  const [selectGen, setSelectGen] = useState('all');
  const [filter, setFilter] = useState([]);
  const [type, setType] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

const toggleShowFavorites = () => {
  setShowFavorites(!showFavorites);
};

useEffect(() => {
  if (showFavorites) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const filteredPokemons = pokemons.filter(pokemon => favorites.includes(pokemon.pokedex_id));
    setFilter(filteredPokemons);
  } else {
    setFilter([...pokemons]);
  }
}, [pokemons, showFavorites]);

  useEffect(() => {
    setFilter([...pokemons]);
    setType([...pokemons][1]?.resistances ?? []);
  }, [pokemons]);

  const ArrayGen = Array.from(Array(9).keys())

  const getSelector = (value) => {
    setSelectType(value);
    let tmp_filter = [...pokemons];
    if (searchTerm){
      tmp_filter = tmp_filter.slice().filter(x => x.name.fr.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectGen !== 'all'){
      tmp_filter = tmp_filter.slice().filter( (x) => x.generation.toString() === selectGen );
    }

    if (value === 'all') {
      setFilter(tmp_filter)
    }else{
      tmp_filter.filter( (x)=> x.types !== null);
      const res = tmp_filter.slice().filter( x =>{
        const tmp = x.types?.map(y => y.name);
        return tmp?.includes(value);
      })
      //console.log(res.length);
      setFilter(res);
    }
  }

  const getSearchTerms = (value) => {
    setSearchTerm(value);
    let tmp_filter = [...pokemons]

    if (selectType !== 'all') {
      tmp_filter = tmp_filter.slice().filter( x =>{
        const tmp = x.types?.map(y => y.name);
        return tmp?.includes(selectType);
      })
    }
    if (selectGen !== 'all'){
      tmp_filter = tmp_filter.slice().filter( (x) => x.generation.toString() === selectGen );
    }
    const res = tmp_filter.slice().filter(x => x.name.fr.toLowerCase().includes(value.toLowerCase()))
    setFilter(res);
  }

  const getSelectGen = (value) => {
    setSelectGen(value.toString());
    let tmp_filter = [...pokemons]
    if (selectType !== 'all') {
      tmp_filter = tmp_filter.slice().filter( x =>{
        const tmp = x.types?.map(y => y.name);
        return tmp?.includes(selectType);
      })
    }
    if (searchTerm){
      tmp_filter = tmp_filter.slice().filter(x => x.name.fr.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (value === 'all') {
      setFilter(tmp_filter);
    }else {
      const res = tmp_filter.slice().filter( (x) => x.generation.toString() === value.toString() );
      setFilter(res)
    }
  }

  return (
    <div className="relative">
    {/* Conteneur pour le cropping de l'image */}
    <div className="overflow-hidden absolute top-0 right-0 z-0 -mr-100" style={{ width: '100%', height: '100vh', maxWidth: '100vw' }}>
      <img src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png" alt="Pokeball" className="opacity-10" style={{ width: '800px', height: 'auto', transform: 'translate(120%, -7%)' }} />
    </div>

    {/* Contenu principal de la page */}
    <div className="mx-auto max-w-screen-xl mt-20">
      {/* Image absolument positionnée qui ne devrait pas impacter le layout global */}
      {/* Barre de recherche avec icône de loupe */}
      <div className="flex justify-center mb-4 rounded-xl z-10 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => getSearchTerms(e.target.value)}
            className="pl-10 p-2 border  h-10 rounded-xl w-96 bg-gray-200 placeholder-gray-100"
          />
          <div className="absolute top-0 left-0 mt-2 ml-3">
            🔍
          </div>
          <select value={selectType} onChange={ (e) => getSelector(e.target.value)} className="w-30 h-10 p-2 border rounded-xl bg-gray-200 text-gray-100 ml-4 text-center">
            <option value={'all'}>Type</option>
            {type.map((type) => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
          {
          <select value={selectGen} onChange={ (e) => getSelectGen(e.target.value)} className="w-30 h-10 p-2 border rounded-xl bg-gray-200 text-gray-100 ml-4 text-center">
            <option value={'all'}>Génération</option>
            {ArrayGen.map((gen) => (
              <option key={gen} value={gen+1}>{gen+1}</option>
            ))}
          </select>
            }
      <button
        onClick={toggleShowFavorites}
        className="w-30 h-10 p-2 border rounded-xl bg-gray-200 text-gray-100 ml-4 text-center"
      >
        {showFavorites ? 'Voir Tous' : 'Voir Favoris'}
      </button>
        </div>
      </div>
      {/* Grille de cartes avec marges latérales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {filter.map((pokemon, index) => (
  <PokemonCard
    key={pokemon.pokedex_id}
    pokemon={pokemon}
    pokemons={filter}
    index={index}
  />
))}
      </div>
    </div>
  </div>
  );
};

export default PokemonList;
