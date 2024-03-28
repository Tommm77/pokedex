import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import FightPokemon from '../FightPokemon/FightPokemon';


const Fight = ({pokemons}) => {
    const  {id} = useParams();
    const [PokemonUser, LoadingUser] = useState([...pokemons][151])
    const [PokemonOpponent, LoadingOpponent] = useState([...pokemons][1])

    //console.log(pokemons)

    useEffect(() => {
        if (id) {
            LoadingUser([...pokemons][id])
        }
        const randomId = Math.floor(Math.random() * 1025) + 1;
        LoadingOpponent([...pokemons][randomId])
    }, [pokemons]);    

    return (
        <div>
            <h1>Combats</h1>
            
            <FightPokemon pokemon={pokemons[1]} />
        </div>
    );
};

export default Fight;
