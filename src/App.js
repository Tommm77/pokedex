import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonList from './components/PokemonList/PokemonList';
import PokemonDetails from './components/PokemonDetails/PokemonDetails';
import './App.css';
import Fight from './components/Fight/Fight';
import usePokemonData from './hooks/usePokemonData';
import PokemonHome from './components/PokemonHome/PokemonHome';


function App() {
  const { pokemons, loading } = usePokemonData();

  if (loading) return <div className="text-center">Chargement...</div>;

  return (
    <div className="App">
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PokemonHome />} />
            <Route path="/pokedex" element={<PokemonList pokemons={pokemons}/>} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
            <Route path="/fight/:id?" element={<Fight pokemons={pokemons}/>} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
