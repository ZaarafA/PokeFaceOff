// DOM MANIPULATIONS
const buttons = document.querySelectorAll(".option");

// Global
let pokemon_data = {};
let past_ids = [];
let user_stats = [0,0,0,0,0,0]

buttons.forEach(element => {
    element.addEventListener("click", e => {
        buttonClick(e);
    })
});

async function buttonClick(e){
    calculate_stats(e);
    await resetPokemon();
}

resetPokemon();

async function resetPokemon(){
    /*
        Load it into pokemon_data

        Replace Sprite
        Change the Name in the title
        Change the numbers in the stats
    */

    // Generate a random number
    let rand_id = Math.floor(Math.random() * 1025) + 1;
    
    // Fetch Pokemon data
    await fetchPokemonData(rand_id);
    past_ids.push(pokemon_data.id);

    // Replace Data
    document.querySelector(".question").innerHTML = `Could you beat ${pokemon_data.name.charAt(0).toUpperCase() + pokemon_data.name.slice(1)} in a fight?`;
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

function calculate_stats(e){
    // recalculate User Stats based on pokemon match up

    /*
    If you would beat a pokemon:
    Its lowest defense increases your corresponding attack
    The increase is the difference between your stats
    only if greater than yours
    Easy = the full difference
    Probably = half diff
    50/50 => 1/4 diff
    subtract otherwise  
    */

    let selection = e.target.innerHTML;

    const responseValues = {
        "Easy": .5,
        "Probably": .25,
        "50/50": .125,
        "Nope": -.25,
        "im dead": -.5
    };
    

    // hp calc
    // get pokemon's higher attack stat
    let pkmn_offense = [0,"stat"];
    if(pokemon_data.stats[1].base_stat > pokemon_data.stats[3].base_stat){
        pkmn_offense[0] = pokemon_data.stats[1].base_stat;
        pkmn_offense[1] = "Attack";
    } else {
        pkmn_offense[0] = pokemon_data.stats[3].base_stat;
        pkmn_offense[1] = "Sp. Atk";
    }
    // get user's higher stat

    // get pokemon's defense
    // get user's defense

    // if EASY, PROBABLY, 50/50
    if((selection == "Easy") || (selection == "Probably") || (selection == "50/50")){
        // HP += pkmnhp - userhp * EASY/PR/50
        // user_stats[0] += ((pokemon_data.stats[0].base_stat - user_stats[0]) * responseValues[selection]);
        // user_stats[0] = Math.round(user_stats[0]);
    }

    updateStats();
}

function updateStats(){

}