import React, { useState, useEffect } from 'react';
import './PokemonHome.css'; // Assurez-vous de créer ce fichier CSS pour le style

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

const Map = () => {
  const [grid, setGrid] = useState(generateGrid());
  const [playerPosition, setPlayerPosition] = useState({ x: parseInt(gridSize / 2), y: parseInt(gridSize / 2) });
  const [playerDirection, setPlayerDirection] = useState('down'); // Direction initiale du joueur

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
            setPlayerDirection(direction);
            console.log('couleur non bleu');
            if (newX !== playerPosition.x || newY !== playerPosition.y) {
                // Vérification pour la rencontre de Pokémon dans les buissons
                if (grid[newY][newX] === 'green' && Math.random() < 0.15) {
                    console.log('Un Pokémon sauvage apparaît !');
                alert('Un Pokémon sauvage apparaît !');
                }
            }
          }
        };
      }


    window.addEventListener('keydown', movePlayer);
    return () => window.removeEventListener('keydown', movePlayer);
  }, [playerPosition]);

  // Fonction pour obtenir la classe CSS de direction
  const getPlayerDirectionClass = () => {
    switch (playerDirection) {
      case 'up':
        return 'player-up';
      case 'down':
        return 'player-down';
      case 'left':
        return 'player-left';
      case 'right':
        return 'player-right';
      default:
        return '';
    }
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((color, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`cell ${color}`}>
              {playerPosition.x === colIndex && playerPosition.y === rowIndex && (
                <img src={playerImages[playerDirection]} alt="Player" className="player-img" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Map;
