import axios from 'axios';

const fetchPokemons = async () => {
  try {
    const response = await axios.get(`https://tyradex.tech/api/v1/pokemon`, {
      headers: {
        'From': 'monemail@example.com',
        'Content-type': 'application/json',
      },
    });
    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des Pokémon :', error);
    return [];
  }
};


export { fetchPokemons };
