import { useState, useEffect } from 'react';
import { fetchPokemons } from '../api/TyradexAPI';

const usePokemonData = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // S'assurer que loading est vrai au début de l'appel
      try {
        const data = await fetchPokemons();
        setPokemons(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
      setLoading(false); // Définir loading à false une fois les données chargées ou en cas d'erreur
    };

    fetchData();
  }, []); // Vérifiez les dépendances du useEffect pour éviter les rendus infinis


  return { pokemons, loading };
};

export default usePokemonData;
