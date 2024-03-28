import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


const Fight = ({pokemons}) => {
    const  {id} = useParams();
    const [PokemonUser, LoadingUser] = useState([...pokemons][151])
    const [PokemonOpponent, LoadingOpponent] = useState([...pokemons][1])

    //console.log(pokemons)

    const damageUser = 0;
    const damageOpponent = 90;

    const getStatWidth = (life, damage) => `${( (life-damage) / life) * 100}%`;
    const getBackgroundColor = (life, damage) => {
        const tmp = ((life-damage) / life) * 100;
        //console.log(tmp)
        if (tmp > 50) {
            return 'bg-green-500';
        }else if (tmp > 25 ) {
            return 'bg-yellow-500';
        }else {
            return 'bg-red-500'
        }
    }

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
            <div className='grid grid-cols-6 mt-20'>
                {/*pokemon opponent*/}
                <div className='col-start-4 col-span-2'>
                    <div className='grid gril-cols-2'>
                        <div className='col-start-1'> 
                            <div style={{width: '10em', marginLeft: '2em'}}>
                                <div className='w-full flex'>
                                    <p className='text-xl'>{PokemonOpponent.name.fr}</p>
                                </div>
                                <div className='border-l-2 border-b-2 border-black rounded-md'>
                                    <div className='w-full flex ml-8'>
                                        <p className='text-xs'>Lv: 50</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center ml-4">
                                            <p>hp: </p>
                                            <div className="ml-1 bg-gray-200 rounded-xl h-2 overflow-hidden w-full border border-black">
                                                <div className={`${getBackgroundColor(100, damageOpponent)} h-full rounded-xl`} style={{ width: getStatWidth(100, damageOpponent) }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-start-2'>
                            <img src={PokemonOpponent.sprites.regular} alt={PokemonOpponent.name.fr} style={{width: '12em', marginRight: '6em'}}/>
                        </div>

                    </div>
                </div>

                {/*pokemon user*/}
                <div className='col-start-2 col-span-2'>
                    <div className='grid gril-cols-2'>
                        <div className='col-start-1'>
                            <img src={PokemonUser.sprites.regular} alt={PokemonUser.name.fr} style={{width: '12em', marginLeft: '6em', transform: 'scaleX(-1)' }}/>
                        </div>
                        <div className='col-start-2'>
                            <div style={{width: '10em'}}>
                                <div className='w-full flex'>
                                    <p className='text-xl'>{PokemonUser.name.fr}</p>
                                </div>
                                <div className='border-r-2 border-b-2 border-black rounded-md p-1'>
                                    <div className='w-full flex ml-8'>
                                        <p className='text-xs'>Lv: 50</p>
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center mr-1">
                                            <p>hp: </p>
                                            <div className="ml-1 bg-gray-200 rounded-xl h-2 overflow-hidden w-full border border-black">
                                                <div className={`${getBackgroundColor(100, damageUser)} h-full rounded-xl`} style={{ width: getStatWidth(100, damageUser) }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*console*/}
                <div className='col-start-2 col-span-4 mt-4'>
                    <div className='grid grid-col-2 mt-10'>
                        <div className='col-start-1'>console</div>
                        <div className='col-start-2 gap-4'>
                            <div className='grid grid-col-2 gap-4'>
                                <div className='col-start-1'>
                                    <button className='bg-gray-300 hover:bg-gray-500 rounded-xl py-3 w-full'>charge</button>
                                </div>
                                <div className='col-start-2'>
                                    <button className='bg-red-300 hover:bg-red-500 rounded-xl py-3 w-full'>attaque spé</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Fight;
