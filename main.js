// DOM MANIPULATIONS
const buttons = document.querySelectorAll(".option");

// Global
let pokemon_data = {};
let past_ids = [];
let user_stats = [0,0,0,0,0,70]
const MAX_BST = 600;

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
    let bst = user_stats.reduce((a, b) => a + b, 0);

    const responseValues = {
        "Easy": .5,
        "Probably": .25,
        "50/50": .125,
        "Nope": -.25,
        "im dead": -.5
    };

    // get pokemon's higher attack stat
    // TODO: make this a ternary
    let pkmn_offense = [0,"stat"];
    if(pokemon_data.stats[1].base_stat > pokemon_data.stats[3].base_stat){
        pkmn_offense[0] = pokemon_data.stats[1].base_stat;
        pkmn_offense[1] = "Attack";
    } else {
        pkmn_offense[0] = pokemon_data.stats[3].base_stat;
        pkmn_offense[1] = "Sp. Atk";
    }

    let pkmn_defense = [0,"stat"];
    if(pokemon_data.stats[2].base_stat > pokemon_data.stats[4].base_stat){
        pkmn_defense[0] = pokemon_data.stats[2].base_stat;
        pkmn_defense[1] = "Defense";
    } else {
        pkmn_defense[0] = pokemon_data.stats[4].base_stat;
        pkmn_defense[1] = "Sp. Def";
    }

    // get user's offense
    let user_offense = [0,"stat"];
    if(user_stats[1] > user_stats[3]){
        user_offense = [user_stats[1], "Attack"]
    } else{
        user_offense = [user_stats[3], "Sp. Atk"]
    }
    // get user's defense
    let user_defense = [0,"stat"];
    if(user_stats[2] > user_stats[4]){
        user_defense = [user_stats[2], "Defense"]
    } else{
        user_defense = [user_stats[4], "Sp. Def"]
    }

    if(bst < MAX_BST){
    // if EASY, PROBABLY, 50/50
        if((selection == "Easy") || (selection == "Probably") || (selection == "50/50")){
            // hp -> if pkmn_offense > user_hp, hp += (pkmn_offense[0] - user_stats[0]) * responseValues[selection]
            if(pkmn_offense[0] > user_stats[0]){
                user_stats[0] += (pkmn_offense[0] - user_stats[0]) * responseValues[selection];
                user_stats[0] = Math.round(user_stats[0]);
            }

            // pokemon offense raises that user's defense
            if((pkmn_offense[1] == "Attack") && (pkmn_offense[0] > user_stats[2])){
                user_stats[2] += (pkmn_offense[0] - user_stats[2]) * responseValues[selection]
                user_stats[2] = Math.round(user_stats[2]);
            } else if((pkmn_offense[1] == "Sp. Atk") && (pkmn_offense[0] > user_stats[4])){
                user_stats[4] += (pkmn_offense[0] - user_stats[4]) * responseValues[selection];
                user_stats[4] = Math.round(user_stats[4]);
            }

            if((pkmn_defense[1] == "Defense") && (pkmn_defense[0] > user_stats[1])){
                user_stats[1] += (pokemon_data.stats[2].base_stat - user_stats[1]) * responseValues[selection]
                user_stats[1] = Math.round(user_stats[1]);
            } else if((pkmn_defense[1] == "Sp. Def") && (pkmn_defense[0] > user_stats[3])){
                user_stats[3] += (pokemon_data.stats[4].base_stat - user_stats[3]) * responseValues[selection]
                user_stats[3] = Math.round(user_stats[3]);
            }

            // BST should be relative to 600
        }
        if((selection == "Nope") || (selection == "im dead")){
            // pkmn offense lowers u hp
            if(pkmn_offense[0] < user_stats[0]){
                user_stats[0] += (user_stats[0] - pkmn_offense[0]) * responseValues[selection];
                user_stats[0] = Math.round(user_stats[0]);
            }
            // pkmn offense lowers that u defense
            if((pkmn_offense[1] == "Attack") && (pkmn_offense[0] < user_stats[2])){
                user_stats[2] += (user_stats[2] - pkmn_offense[0]) * responseValues[selection]
                user_stats[2] = Math.round(user_stats[2]);
            } else if((pkmn_offense[1] == "Sp. Atk") && (pkmn_offense[0] < user_stats[4])){
                user_stats[4] += (user_stats[4] - pkmn_offense[0]) * responseValues[selection]
                user_stats[4] = Math.round(user_stats[4]);
            }

            // pkmn defense lowers that u offense
            if((pkmn_defense[1] == "Defense") && (user_stats[1] > pkmn_defense[0])){
                user_stats[1] += (user_stats[1] - pkmn_defense[0]) * responseValues[selection]
                user_stats[1] = Math.round(user_stats[1]);
            } else if((pkmn_defense[1] == "Sp. Def") && (user_stats[3] > pkmn_defense[0])){
                user_stats[3] += (user_stats[3] - pkmn_defense[0]) * responseValues[selection]
                user_stats[3] = Math.round(user_stats[3]);
            }
        }
    }



    updateStats();
}

function updateStats(){
    // Replace Stats
    document.querySelector("#user_hp_num").innerHTML = user_stats[0];
    document.querySelector("#user_atk_num").innerHTML = user_stats[1];
    document.querySelector("#user_def_num").innerHTML = user_stats[2];
    document.querySelector("#user_spatk_num").innerHTML = user_stats[3];
    document.querySelector("#user_spdef_num").innerHTML = user_stats[4];
    document.querySelector("#user_spe_num").innerHTML = user_stats[5];
    // Render Stat Bars
    document.querySelector("#user_hp_bar").style = `width: ${(user_stats[0] / 200)*100}%`;
    document.querySelector("#user_atk_bar").style.width = `${(user_stats[1] / 200)*100}%`;
    document.querySelector("#user_def_bar").style.width = `${(user_stats[2] / 200)*100}%`;
    document.querySelector("#user_spatk_bar").style.width = `${(user_stats[3] / 200)*100}%`;
    document.querySelector("#user_spdef_bar").style.width = `${(user_stats[4] / 200)*100}%`;
    document.querySelector("#user_spe_bar").style.width = `${(user_stats[5] / 200)*100}%`;
}