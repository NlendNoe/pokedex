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