let offset = 0
const limit = 7
const container = document.getElementById('pokemon-cards')
const loadingIcon = document.getElementById('loading-icon')
let isLoading = false // Indicateur pour éviter plusieurs chargements simultanés

// Fonction pour récupérer les Pokémon depuis l'API
async function fetchPokemon() {
    if (isLoading) return; // Empêche les appels multiples

    isLoading = true; // Définir l'état de chargement
    loadingIcon.style.display = 'block'

    try {
        // URL de l'API avec les paramètres offset et limit
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        const data = await response.json()

        // Traiter chaque Pokémon reçu
        for (let pokemon of data.results) {
            // Récupérer les détails de chaque Pokémon pour afficher des informations supplémentaires
            const pokemonDetails = await fetch(pokemon.url)
            const pokemonData = await pokemonDetails.json()

            createPokemonCard(pokemonData)
        }

        // Mettre à jour l'offset pour le prochain lot
        offset += limit

    } catch (error) {
        console.error('Erreur lors du chargement des Pokémon:', error)
    } finally {

        loadingIcon.style.display = 'none'
        isLoading = false

        if (document.body.offsetHeight <= window.innerHeight) {
            fetchPokemon() // Charger un autre lot de Pokémon
        }
    }
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div')
    card.classList.add('card')

    const type = pokemon.types[0].type.name;
    card.style.backgroundColor = getTypeColor(type);

    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" width="150">
        <p>${pokemon.name}</p>
        
    `;
    container.appendChild(card)

    card.addEventListener('click', () => openModal(pokemon))

    container.appendChild(card)
}
// 

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
    return typeColors[type] || '#fff'
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

const nav = document.querySelector('#nav_bar')
const pokedex = document.querySelector('#pokedex-container')
const initialPosition = pokedex.getBoundingClientRect()

window.addEventListener('scroll', (e) => {
    e.preventDefault()
    if (window.scrollY > initialPosition.top) nav.classList.add('appier')
    else nav.classList.remove('appier')

})

//FONCTION DE RECHERCHE

const searchPoke = document.querySelector('#searchPoke');

searchPoke.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase()

    container.innerHTML = ''

    if (query === '') {
        // Si la recherche est vide, recharger les Pokémon par lot
        fetchPokemon()
        return
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        if (!response.ok) {
            throw new Error('Pokemon not found')
        }
        const pokemonData = await response.json()
        createPokemonCard(pokemonData)
    } catch (error) {
        container.innerHTML = "<h1>Humm... Désolé aucune correspondance (┬┬﹏┬┬) </h1>"
    }
});

const modal = document.getElementById('pokemonModal')
const modalImg = document.getElementById('modal-pokemon-image')
const modalName = document.getElementById('modal-pokemon-name')
const modalType = document.getElementById('modal-pokemon-type')
const modalStats = document.getElementById('modal-pokemon-stats')
const modalAttacks = document.getElementById('modal-pokemon-attacks')
const closeModal = document.getElementById('closeModal')
const overlay = document.querySelector('.overlay')
const playSoundButton = document.getElementById('play-sound')

function openModal(pokemon) {
    modalImg.src = pokemon.sprites.front_default;
    modalName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    modalType.textContent = `Type: ${pokemon.types.map(t => t.type.name).join(', ')}`

    modalStats.textContent = `
        HP: ${pokemon.stats[0].base_stat} 
        | Attack: ${pokemon.stats[1].base_stat} 
        | Defense: ${pokemon.stats[2].base_stat}
    `;

    const moves = pokemon.moves.slice(0, 4).map(move => move.move.name).join(', ')
    modalAttacks.textContent = `Attacks: ${moves}`

    const soundUrl = `https://play.pokemonshowdown.com/audio/sounds/${pokemon.name}.mp3`

    playSoundButton.onclick = () => {
        const audio = new Audio(soundUrl)
        audio.play();
    };

    modal.classList.remove('hidden')
    modal.style.display = 'flex'
    modalImg.style.width = "250px"
}

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden')
    modal.style.display = 'none'
});

overlay.addEventListener('click', () => {
    modal.classList.add('hidden')
    modal.style.display = 'none'
});
