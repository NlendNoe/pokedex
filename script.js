let offset = 0; 
const limit = 7; 
const container = document.getElementById('pokemon-cards');
const loadingIcon = document.getElementById('loading-icon');
let isLoading = false; // Indicateur pour éviter plusieurs chargements simultanés

// Fonction pour récupérer les Pokémon depuis l'API
async function fetchPokemon() {
    if (isLoading) return; // Empêche les appels multiples

    isLoading = true; // Définir l'état de chargement
    loadingIcon.style.display = 'block'; 

    try {
        // URL de l'API avec les paramètres offset et limit
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        
        // Traiter chaque Pokémon reçu
        for (let pokemon of data.results) {
            // Récupérer les détails de chaque Pokémon pour afficher des informations supplémentaires
            const pokemonDetails = await fetch(pokemon.url);
            const pokemonData = await pokemonDetails.json();

            createPokemonCard(pokemonData);
        }

        // Mettre à jour l'offset pour le prochain lot
        offset += limit;

    } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error);
    } finally {

        loadingIcon.style.display = 'none';
        isLoading = false;

        if (document.body.offsetHeight <= window.innerHeight) {
            fetchPokemon(); // Charger un autre lot de Pokémon
        }
    }
}

// Fonction pour créer une carte Pokémon
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Définir la couleur de fond selon le type du Pokémon
    const type = pokemon.types[0].type.name;
    card.style.backgroundColor = getTypeColor(type);

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>${pokemon.name}</p>
    `;

    container.appendChild(card);
}

// Fonction pour obtenir la couleur en fonction du type de Pokémon
function getTypeColor(type) {
    const typeColors = {
        fire: '#F08030',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ground: '#E0C068',
        psychic: '#F85888',
        rock: '#B8A038',
        ghost: '#705898',
    };
    return typeColors[type] || '#A8A878';
}

// Fonction pour gérer le défilement infini
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        // Charger un nouveau lot de Pokémon quand l'utilisateur atteint presque le bas de la page
        fetchPokemon();
    }
});

// Charger le premier lot de Pokémon au démarrage
fetchPokemon();
