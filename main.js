// DOM MANIPULATIONS
const buttons = document.querySelectorAll(".option");

// Global
let pokemon_data = {};
let past_ids = [];

buttons.forEach(element => {
    element.addEventListener("click", e => {
        buttonClick(e);
    })
});

async function buttonClick(e){
    await resetPokemon();
}

async function resetPokemon(){
    /*
        Generate a random number
        Fetch that Pokemon's data
        Load it into pokemon_data
        Add id num into past_ids 

        Replace Sprite
        Change the Name in the title
        Change the numbers in the stats
    */

    let rand_id = Math.floor(Math.random() * 1025) + 1;
    
    // Fetch Data
    await fetchPokemonData(rand_id);


}

async function fetchPokemonData(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try{
        let response = await fetch (url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        pokemon_data = data;
        console.log(pokemon_data);

    } catch(error){
        console.error("Error fetching Pokemon Data.")
    }
}

function calculate_stats(){
    // recalculate User Stats based on pokemon match up
}