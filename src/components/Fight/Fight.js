import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Fight.css';
import { useNavigate } from 'react-router-dom';

const Fight = ({pokemons}) => {
    const  {id} = useParams();
    const [PokemonUser, LoadingUser] = useState([...pokemons][151])
    const [PokemonOpponent, LoadingOpponent] = useState([...pokemons][1])
    const [damageUser, SetdamageUser] = useState(0)
    const [damageOpponent, SetdamageOpponent] = useState(0)
    const [consoleInfo, SetConsole] = useState(['début du combat...'])
    const [positionOp, setPositionOp] = useState({ x: 0, y: 0 });
    const [positionUser, setPositionUser] = useState({ x: 0, y: 0 });

    const handleMoveOp = () => {
        // Logique pour déplacer l'image, par exemple, augmenter la valeur de x et y
        setPositionOp(prevPosition => ({
          x: prevPosition.x + 30,
          y: prevPosition.y + 30,
        }));
        setTimeout(() => { 
            setPositionOp(prevPosition => ({
                x: prevPosition.x - 30,
                y: prevPosition.y - 30,
              }));
        }, 500);
    };

    const handleMoveUser = () => {
        // Logique pour déplacer l'image, par exemple, augmenter la valeur de x et y
        setPositionUser(prevPosition => ({
          x: prevPosition.x + 30,
          y: prevPosition.y + 30,
        }));
        setTimeout(() => { 
            setPositionUser(prevPosition => ({
                x: prevPosition.x - 30,
                y: prevPosition.y - 30,
              }));
        }, 500);
    };

    const typeColors = {
        Normal: 'bg-gray-500 hover:bg-gray-600',
        Plante: 'bg-green-500 hover:bg-green-600',
        Feu: 'bg-red-500 hover:bg-red-600',
        Eau: 'bg-blue-500 hover:bg-blue-600',
        Électrik: 'bg-yellow-500 hover:bg-yellow-600',
        Glace: 'bg-cyan-500 hover:bg-cyan-600',
        Combat: 'bg-orange-500 hover:bg-orange-600',
        Poison: 'bg-purple-500 hover:bg-purple-600',
        Sol: 'bg-yellow-700 hover:bg-yellow-800',
        Vol: 'bg-blue-300 hover:bg-blue-400',
        Psy: 'bg-pink-500 hover:bg-pink-600',
        Insecte: 'bg-lime-500 hover:bg-lime-600',
        Roche: 'bg-yellow-800 hover:bg-yellow-900',
        Spectre: 'bg-indigo-500 hover:bg-indigo-600',
        Dragon: 'bg-purple-700 hover:bg-purple-800',
        Ténèbres: 'bg-gray-800 hover:bg-gray-900',
        Acier: 'bg-gray-400 hover:bg-gray-500',
        Fée: 'bg-pink-300 hover:bg-pink-400',
    };
    const navigate = useNavigate();

    const getTalentColor = (type) => typeColors[type] || 'bg-gray-200';

    const CalculDamage = (oriented) => {
        let pokemonAtk;
        let pokemonDef;
        if (oriented === 1) {
            pokemonAtk = PokemonUser
            pokemonDef = PokemonOpponent
        }else {
            pokemonAtk = PokemonOpponent
            pokemonDef = PokemonUser
        }
        let atk = (parseInt(pokemonAtk.stats.atk) / parseInt(pokemonDef.stats.def)) * 5;
        const typeAtk = pokemonAtk.types.map((x) => x.name)
        const resist = pokemonDef.resistances.filter( (x) => typeAtk.includes(x.name)).map( x=> parseFloat(x.multiplier))
        resist.reduce( (acc, x) => acc * x )
        const random = Math.floor(Math.random() * 5) + 1;
        atk *= resist.reduce((acc, x) => acc * x )
        return Math.round(atk * random);
    }

    const getStatWidth = (life, damage) => {
        return (life-damage) > 0?  `${( (life-damage) / life) * 100}%` : '0'
    };

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
            const randomId = Math.floor(Math.random() * 1025) + 1;
            LoadingOpponent([...pokemons][randomId])
        }else {
            navigate(`/pokedex`);
        }
    }, []);

    const AtkUser = (type) => {
        let tmp_damage = damageOpponent;
        let tmp_console = PokemonUser.name.fr;
        if (type == 1) {
            tmp_damage += 10
            tmp_console += ' utilse attaque charge de 10'
        } else if (type == 2) {
            const calcul = CalculDamage(1)
            tmp_damage += calcul;
            tmp_console += ' utilse attaque spé de '+calcul.toFixed(2)
        }
        SetdamageOpponent(tmp_damage)
        handleMoveUser()
        if (tmp_damage >= PokemonOpponent.stats.hp){
            SetConsole(['gagné', PokemonOpponent.name.fr+' est mort'])
            navigate(`/`+PokemonUser.pokedex_id);
        }else{
            const tmp_console_all = [...[tmp_console], ...consoleInfo]
            SetConsole(tmp_console_all)
            setTimeout(() => { BOTOpponent(tmp_console_all);}, 500);
        }
    }

    const BOTOpponent = (console) => {
        const randomAtk = Math.floor(Math.random()*2);
        let tmp_damage = damageUser;
        let tmp_console = PokemonOpponent.name.fr;
        if (randomAtk == 0) {
            tmp_damage += 10
            tmp_console += ' utilse attaque charge de 10'
        } else if (randomAtk == 1) {
           const calcul = CalculDamage(1)
            tmp_damage += calcul;
            tmp_console += ' utilse attaque spé de '+calcul.toFixed(2)
        }
        SetdamageUser(tmp_damage)
        handleMoveOp();
        if (tmp_damage >= PokemonUser.stats.hp) {
            SetConsole(['perdu', PokemonUser.name.fr+' est mort'])
            navigate(`/pokedex`);
        }else {
            SetConsole([...[tmp_console], ...console])
        }
    }

    return (
        <div className='container-battle'>
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
                                                <div className={`${getBackgroundColor(PokemonOpponent.stats.hp, damageOpponent)} h-full rounded-xl`} style={{ width: getStatWidth(PokemonOpponent.stats.hp, damageOpponent) }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-start-2'>
                            <img 
                                src={PokemonOpponent.sprites.regular} 
                                alt={PokemonOpponent.name.fr} 
                                style={{width: '12em', marginRight: '6em', position: 'relative', top: `${positionOp.y}px`, right: `${positionOp.x}px`}} 
                            />
                        </div>

                    </div>
                </div>

                {/*pokemon user*/}
                <div className='col-start-2 col-span-2'>
                    <div className='grid gril-cols-2'>
                        <div className='col-start-1'>
                            <img 
                                src={PokemonUser.sprites.regular} 
                                alt={PokemonUser.name.fr} 
                                style={{
                                    width: '12em', 
                                    marginLeft: '6em', 
                                    transform: 'scaleX(-1)', 
                                    position: 'relative', 
                                    bot: `${positionUser.y}px`, 
                                    left: `${positionUser.x}px` 
                                }}/>
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
                                                <div className={`${getBackgroundColor(PokemonUser.stats.hp, damageUser)} h-full rounded-xl`} style={{ width: getStatWidth(PokemonUser.stats.hp, damageUser) }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*console*/}
                <div className='col-start-2 col-span-4 mt-2'>
                    <div className='grid grid-col-2 mt-10'>
                        <div className='col-start-1 w-full border-2 border-black rounded-lg p-1'>
                            <p className='flex underline'>console:</p>
                            <div>
                                {
                                    consoleInfo.slice(0, 5).reverse().map( ((x, index) =>
                                        <p key={index}>{x}</p>
                                    ))}
                            </div>
                        </div>
                        <div className='col-start-2 gap-4 border-2 border-black rounded-lg p-1 h-40'>
                            <p className='flex underline'>attaques:</p>
                            <div className='grid grid-col-2 gap-4'>
                                <div className='col-start-1 w-full mt-8'>
                                    <button onClick={() => AtkUser(1)} className='bg-gray-300 hover:bg-gray-500 rounded-xl p-3 w-2/3'>charge</button>
                                </div>
                                <div className='col-start-2 w-full mt-8'>
                                    <button onClick={() => AtkUser(2)} className={`${getTalentColor(PokemonUser.types[0].name)} rounded-xl p-3 w-2/3`}>
                                        {PokemonUser.talents[0]?.name ?? ''}
                                    </button>
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
