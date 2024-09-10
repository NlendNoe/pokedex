console.log('pokemons');
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/ditto'
const displaPokemonLimit = 8
let offset = 0
// variable pour eviter les appels API simultanés 
let loading = false

// fonction pour recup les pokemons
async function recupPokemons(limit, loading) {
    const reponse = await fetch(`${apiUrl}?limit=${displaPokemonLimit}&offset=${offset}`)

    //Transformation de la reponse en json
    const data = await reponse.json()
    return data.results
}

//fonction pour recup des details sur les pokemons
async function recupPokemonsDetail(name) {
    const reponsePokemon = await fetch('https://pokeapi.co/api/v2/pokemon/ditto')
    const dataPokemon = await reponsePokemon.json()
    return dataPokemon
}

// fonction pour les types de pokemons
function elementsColor(type) {
    const typeColors = {
        fire: '#f08030',
        water: '#6890f0',
        grass: '#78c850',
        electric: '#f8d030',
        ice: '#98d8d8',
        fighting: '#c03028',
        poison: '#a040a0',
        ground: '#e0c068',
        flying: '#a890f0',
        psychic: '#f85888',
        bug: '#a8b820',
        rock: '#b8a038',
        ghost: '#705898',
        dragon: '#7038f8',
        dark: '#705848',
        steel: '#b8b8d0',
        fairy: '#f0b6bc',
        normal: '#a8a878'
}
return typeColors[type] || '#a8a878'
}