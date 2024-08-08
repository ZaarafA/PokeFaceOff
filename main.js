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

    // Replace Data
    document.querySelector(".question").innerHTML = `Could you beat ${pokemon_data.name} in a fight?`;
    document.querySelector("#pkmn_img").src = pokemon_data.sprites.front_default;
    document.querySelector("#pkmn_height").innerHTML = `Height: ${(pokemon_data.height)/10}m`
    document.querySelector("#pkmn_weight").innerHTML = `Weight: ${(pokemon_data.weight)/10}kg`
    // Replace Stats
    document.querySelector("#pkmn_hp_num").innerHTML = pokemon_data.stats[0].base_stat;
    document.querySelector("#pkmn_atk_num").innerHTML = pokemon_data.stats[1].base_stat;
    document.querySelector("#pkmn_def_num").innerHTML = pokemon_data.stats[2].base_stat;
    document.querySelector("#pkmn_spatk_num").innerHTML = pokemon_data.stats[3].base_stat;
    document.querySelector("#pkmn_spdef_num").innerHTML = pokemon_data.stats[4].base_stat;
    document.querySelector("#pkmn_spe_num").innerHTML = pokemon_data.stats[5].base_stat;
    // Render Stat Bars
    document.querySelector("#pkmn_hp_bar").style = `width: ${(pokemon_data.stats[0].base_stat / 200)*100}%`;
    document.querySelector("#pkmn_atk_bar").style.width = `${(pokemon_data.stats[1].base_stat / 200)*100}%`;
    document.querySelector("#pkmn_def_bar").style.width = `${(pokemon_data.stats[2].base_stat / 200)*100}%`;
    document.querySelector("#pkmn_spatk_bar").style.width = `${(pokemon_data.stats[3].base_stat / 200)*100}%`;
    document.querySelector("#pkmn_spdef_bar").style.width = `${(pokemon_data.stats[4].base_stat / 200)*100}%`;
    document.querySelector("#pkmn_spe_bar").style.width = `${(pokemon_data.stats[5].base_stat / 200)*100}%`;
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