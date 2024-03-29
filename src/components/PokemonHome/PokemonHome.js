import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PokemonHome.css'; // Assurez-vous de créer ce fichier CSS pour le style
import { Link } from 'react-router-dom';

const playerImages = {
    up: require('../../assets/joueur_up.png'),
    down: require('../../assets/joueur_down.png'),
    left: require('../../assets/joueur_left.png'),
    right: require('../../assets/joueur_right.png')
  };

const gridSize = 25;
const minWaterSize = 3;
const minBushSize = 4;
// Paramètre de densité pour les routes, ajustez cette valeur pour changer la densité
const roadDensity = 0.6; // Entre 0 et 1, où 1 signifie que toutes les cases non attribuées deviennent des routes

const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const audioUrl = require('../../assets/combat01.mp3');
const audioUrlRoute = require('../../assets/route01.mp3');

const ensurePlayerSpawnArea = (grid) => {
  const centerX = Math.floor(gridSize / 2);
  const centerY = Math.floor(gridSize / 2);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (centerX + i >= 0 && centerX + i < gridSize && centerY + j >= 0 && centerY + j < gridSize) {
        grid[centerY + j][centerX + i] = 'gray';
      }
    }
  }
};

// Fonction pour initialiser la grille avec des conditions spécifiques
const generateGrid = () => {
  let grid = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => null));

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        // Ajustement pour intégrer la densité des routes
        const rand = Math.random();
        if (rand < roadDensity) {
          // Prioriser les routes en fonction de la densité spécifiée
          grid[i][j] = 'gray';
        } else {
          const type = randomInRange(1, 2); // 1 pour l'eau, 2 pour les buissons
          if (type === 1) { // Eau
            for (let k = 0; k < minWaterSize; k++) {
              if (i + k < gridSize) grid[i + k][j] = 'blue';
            }
          } else { // Buissons
            for (let k = 0; k < minBushSize; k++) {
              if (j + k < gridSize) grid[i][j + k] = 'green';
            }
          }
        }
      }
    }
  }

  // Remplir les espaces restants avec des routes si non attribués
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!grid[i][j]) {
        grid[i][j] = 'gray'; // Les espaces non attribués deviennent des routes
      }
    }
  }
  ensurePlayerSpawnArea(grid);
  return grid;
};


const PokemonHome = () => {
  const {id} = useParams();
  const routeAudioRef = useRef(null);
  const combatAudioRef = useRef(null);
  
  const [grid, setGrid] = useState(() => {
    const savedGrid = localStorage.getItem('pokemonGrid');
    return savedGrid ? JSON.parse(savedGrid) : generateGrid();
  });
  
  const [playerPosition, setPlayerPosition] = useState(() => {
    const savedPosition = localStorage.getItem('playerPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: parseInt(gridSize / 2), y: parseInt(gridSize / 2) };
  });
  
  const [playerDirection, setPlayerDirection] = useState(() => {
    const savedDirection = localStorage.getItem('playerDirection');
    return savedDirection || 'down';
  });
  
  const [showAnimation, setShowAnimation] = useState(false);
  const [isCombat, setIsCombat] = useState(false);

  const navigate = useNavigate();
  const handleNewMap = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setPlayerPosition({ x: parseInt(gridSize / 2), y: parseInt(gridSize / 2) })
    localStorage.setItem('playerPosition', JSON.stringify({ x: parseInt(gridSize / 2), y: parseInt(gridSize / 2) }));
    localStorage.setItem('playerDirection', 'down');
  };

  // À chaque fois que la grille change, l'enregistrer dans le localStorage
  useEffect(() => {
    localStorage.setItem('pokemonGrid', JSON.stringify(grid));
    const routeAudio = routeAudioRef.current;
    if (routeAudio) {
      routeAudio.pause();
      routeAudio.currentTime = 0; // Réinitialiser pour une future lecture
    }
  }, [grid]);

  useEffect(() => {
    localStorage.setItem('playerDirection', playerDirection);
  }, [playerDirection]);

  const handleKeyDown = (e) => {
    const routeAudio = routeAudioRef.current;
    if (routeAudio) {
      routeAudio.play()
        .catch(err => console.log("Erreur lors de la tentative de jouer l'audio de la route", err));
    }
    // Si une des touches fléchées est pressée, empêcher le défilement par défaut.
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const movePlayer = (e) => {
        console.log(isCombat);
        if (isCombat) {
          // Ne rien faire si le curseur n'est pas dans grid_game ou si un combat est en cours
          return;
        }
        const playCombatAudio = () => {
          const combatAudio = combatAudioRef.current;
          if (combatAudio) {
            combatAudio.play()
              .then(() => {
                setTimeout(() => {
                  combatAudio.pause();
                  combatAudio.currentTime = 0;
                }, 2000); // Durée de l'audio de combat
              })
              .catch(err => console.log("Erreur de lecture audio de combat", err));
          }
        };
        let newX = playerPosition.x;
        let newY = playerPosition.y;
        let direction = playerDirection;
        if (e.key == 'ArrowUp' || e.key == 'ArrowDown'|| e.key == 'ArrowLeft'|| e.key == 'ArrowRight') {
          switch (e.key) {
              case 'ArrowUp':
                if (newY > 0) {
                  if (grid[newY - 1][newX] !== 'blue') {
                      newY--;
                  }
                  direction = 'up';
                }
                break;
              case 'ArrowDown':
                if (newY < gridSize - 1) {
                  if (grid[newY + 1][newX] !== 'blue') {
                      newY++;
                  }
                  direction = 'down';
                }
                break;
              case 'ArrowLeft':
                if (newX > 0) {
                  if (grid[newY][newX - 1] !== 'blue') {
                      newX--;
                  }
                  direction = 'left';
                }
                break;
              case 'ArrowRight':
                if (newX < gridSize - 1) {
                  if (grid[newY][newX + 1] !== 'blue') {
                      newX++;
                  }
                  direction = 'right';
                }
                break;
            }
            console.log(grid[newY][newX]);
            // Mettre à jour la position et la direction du joueur
            if (grid[newY][newX] !== 'blue') {
              setPlayerPosition({ x: newX, y: newY });
              localStorage.setItem('playerPosition', JSON.stringify({ x: newX, y: newY }));
              setPlayerDirection(direction);
              console.log('couleur non bleu');
              if (newX !== playerPosition.x || newY !== playerPosition.y) {
                  // Vérification pour la rencontre de Pokémon dans les buissons
                  if (grid[newY][newX] === 'green' && Math.random() < 0.15) {
                      console.log('Un Pokémon sauvage apparaît !');
                      const routeAudio = routeAudioRef.current;
                      if (routeAudio) {
                        routeAudio.pause();
                        routeAudio.currentTime = 0; // Réinitialiser pour une future lecture
                      }
                      setIsCombat(true);
                      setTimeout(() => {
                        playCombatAudio();
                        setShowAnimation(true); // Déclenche l'animation
                        setTimeout(() => {
                          if (id) {
                            navigate('/Fight/'+ id);
                          }else{
                            navigate('/Fight');
                          }
                          
                        }, 1500);
                      }, 10);
                  }
              }
            }
          };
        }
      movePlayer(e);
    }
  };

  return (
<div className="pokemon-home-container">
  <header className="header_home">
    <h1 className="title">Projet Pokedex</h1>
  </header>
  <main className="flex justify-center "> {/* Assure que le contenu principal couvre au moins toute la hauteur de l'écran */}
    <audio ref={routeAudioRef} src={audioUrlRoute} loop hidden />
    <audio ref={combatAudioRef} src={audioUrl} hidden />
    <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4"> {/* Utilise flex-col pour les écrans mobiles et flex-row pour les écrans plus grands */}
      <div className="w-full flex-col justify-center items-center mb-4 sm:mb-0"> {/* Ajoute une marge en bas uniquement sur les écrans mobiles */}
        <div 
          className="grid bg-white shadow-xl p-8 rounded-lg grid_game w-[min-content] mx-auto"
          tabIndex={0} // Rend le div focusable
          onKeyDown={handleKeyDown} // Attache le gestionnaire d'événements
        >
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row flex">
              {row.map((color, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className={`cell cell_${color}`}>
                  {playerPosition.x === colIndex && playerPosition.y === rowIndex && (
                    <img src={playerImages[playerDirection]} alt="Player" className="player-img" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="w-full justify-center items-center">
          <button 
            onClick={handleNewMap} 
            className="mt-4 bg-gray-200 hover:bg-gray-700 text-gray-800 hover:text-white font-bold py-2 px-4 rounded"
          >
            Changer de Map
          </button>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link 
          to="/pokedex" 
          className="w-[80%] inline-block bg-gray-200 hover:bg-gray-700 text-gray-800 hover:text-white font-bold py-4 px-8 rounded-lg transition duration-150 ease-in-out shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mx-auto"
        >
          Voir le Pokedex
        </Link>
      </div>
    </div>
  </main>
  <div>
      {/* Votre contenu existant */}
      {showAnimation && <div className="battleAnimation"></div>}
    </div>
</div>



  );
};

export default PokemonHome;
