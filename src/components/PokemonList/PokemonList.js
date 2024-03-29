import React, { useState } from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';

const PokemonList = ({pokemons}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectType, setSelectType] = useState('all');
  const [selectGen, setSelectGen] = useState('all');
  const [filter, setFilter] = useState([...pokemons]);
  const [type] = useState([...pokemons][1]?.resistances ?? []);
  const [showFavorites, setShowFavorites] = useState(true);

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

    if (!showFavorites) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      tmp_filter = tmp_filter.slice().filter(pokemon => favorites.includes(pokemon.pokedex_id));
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

    if (!showFavorites) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      tmp_filter = tmp_filter.slice().filter(pokemon => favorites.includes(pokemon.pokedex_id));
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
    if (!showFavorites) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      tmp_filter = tmp_filter.slice().filter(pokemon => favorites.includes(pokemon.pokedex_id));
    }
    if (value === 'all') {
      setFilter(tmp_filter);
    }else {
      const res = tmp_filter.slice().filter( (x) => x.generation.toString() === value.toString() );
      setFilter(res)
    }
  }

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    //console.log(showFavorites)
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

    if (selectGen !== 'all'){
      tmp_filter = tmp_filter.slice().filter( (x) => x.generation.toString() === selectGen );
    }

    if (showFavorites) {
      let tmp_filter  = [...filter];
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const filteredPokemons = tmp_filter.filter(pokemon => favorites.includes(pokemon.pokedex_id));
      setFilter(filteredPokemons);
    } else {
      setFilter(tmp_filter)
    }
  };

  const DeleteFavorite = () => {
    localStorage.removeItem('favorites');
    toggleShowFavorites();
  }

  return (
    <div className="relative">
    <div className="overflow-hidden absolute top-0 right-0 z-0 -mr-100" style={{ width: '100%', height: '100vh', maxWidth: '100vw' }}>
      <img src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png" alt="Pokeball" className="opacity-10" style={{ width: '800px', height: 'auto', transform: 'translate(120%, -7%)' }} />
    </div>

    <div className="mx-auto max-w-screen-xl mt-20">
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
        {showFavorites ? 'Voir Favoris' : 'Voir Tous'}
      </button>
        </div>
        <button
        onClick={DeleteFavorite}
        className="w-30 h-10 p-2 border rounded-xl bg-gray-200 text-gray-100 ml-4 text-center"
      >
        Clear Favoris
      </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {filter.filter( x => x.pokedex_id !== 0).map((pokemon, index) => (
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
