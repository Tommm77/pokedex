import React, { useState, useEffect } from 'react';
import usePokemonData from '../../hooks/usePokemonData';
import PokemonCard from '../PokemonCard/PokemonCard';

const PokemonList = () => {
  const { pokemons, loading } = usePokemonData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectType, setSelectType] = useState('');
  const [selectGen, setSelectGen] = useState('');
  const [filter, setFilter] = useState([]);
  const [type, setType] = useState([]);

  useEffect(() => {
    setFilter([...pokemons]);
    setType([...pokemons][1]?.resistances ?? []);
  }, [pokemons]);

  const ArrayGen = Array.from(Array(9).keys())

  const getSelector = (value) => {
    setSelectType(value.toString());
    let tmp_filter = [...pokemons];
    if (searchTerm){
      tmp_filter = tmp_filter.slice().filter(x => x.name.fr.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    /*
    if (selectGen !== 'all'){
      tmp_filter = tmp_filter.slice().filter( (x) => x.generation.toString() === selectGen );
    }*/

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
/*
    if (selectGen !== 'all'){
      tmp_filter = tmp_filter.slice().filter( (x) => x.generation.toString() === selectGen );
    }*/
    const res = tmp_filter.slice().filter(x => x.name.fr.toLowerCase().includes(value.toLowerCase()))
    setFilter(res);
  }

  const getSelectGen = (value) => {
    setSelectGen(value);
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
      const res = tmp_filter.slice().filter( (x) => x.generation.toString() === value );
      console.log(selectType, searchTerm, res.length)
      setFilter(res)
    }
  }

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div className="absolute">
      <div className="absolute -top-10 -right-20 z-0">
        <img src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png" alt="Pokeball" className="opacity-10 h-full w-full" />
      </div>

      <h1 className="text-4xl text-center my-8 z-10 relative">Pokedex</h1>
      {/* Barre de recherche avec icône de loupe */}
      <div className="flex justify-center mb-4 rounded-xl z-10 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => getSearchTerms(e.target.value)}
            className="pl-10 p-2 border rounded-xl w-96 bg-gray-200 placeholder-gray-100"
          />
          <div className="absolute top-0 left-0 mt-2 ml-3">
            🔍
          </div>
          <select value={selectType} onChange={ (e) => getSelector(e.target.value)} className="p-2 border rounded ml-4">
            <option value={'all'}>tout</option>
            {type.map((type) => (
              <option key={type.name} value={type.name}>{type.name}</option>
            ))}
          </select>
          {/*
          <select value={selectGen} onChange={ (e) => getSelectGen(e.target.value)} className="p-2 border rounded ml-4">
            <option value={'all'}>toutes</option>
            {ArrayGen.map((gen) => (
              <option key={gen} value={gen+1}>{gen+1}</option>
            ))}
          </select>
            */}
        </div>
      </div>
      {/* Grille de cartes avec marges latérales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 mx-48 z-10 relative">
        {filter.map(pokemon => (
          <PokemonCard key={pokemon.pokedex_id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
