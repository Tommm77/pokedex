import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    return savedDirection || 'down'; // 'down' est la valeur par défaut si rien n'est trouvé dans le localStorage
  });
  
  const [showAnimation, setShowAnimation] = useState(false);
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
  }, [grid]);

  useEffect(() => {
    const movePlayer = (e) => {
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
                    setTimeout(() => {
                      // alert('Un Pokémon sauvage apparaît !');
                      setShowAnimation(true); // Déclenche l'animation
                      setTimeout(() => {
                        navigate('/Fight/');
                      }, 1500);
                    }, 10);
                }
            }
          }
        };
      }


    window.addEventListener('keydown', movePlayer);
    return () => window.removeEventListener('keydown', movePlayer);
  }, [playerPosition]);
  useEffect(() => {
    localStorage.setItem('playerDirection', playerDirection);
  }, [playerDirection]);

  // // Fonction pour obtenir la classe CSS de direction
  // const getPlayerDirectionClass = () => {
  //   switch (playerDirection) {
  //     case 'up':
  //       return 'player-up';
  //     case 'down':
  //       return 'player-down';
  //     case 'left':
  //       return 'player-left';
  //     case 'right':
  //       return 'player-right';
  //     default:
  //       return '';
  //   }
  // };

  const handleKeyDown = (e) => {
    // Si une des touches fléchées est pressée, empêcher le défilement par défaut.
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
<div className="pokemon-home-container">
  <header className="header_home">
    <h1 className="title">Projet Pokedex</h1>
  </header>
  <main className="flex justify-center"> {/* Assure que le contenu principal couvre au moins toute la hauteur de l'écran */}
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
