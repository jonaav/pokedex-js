

const apiUrl = "https://pokeapi.co/api/v2/pokemon-species";


const paginationButtons = document.querySelectorAll(".btn-pages");
const cardsContainer = document.getElementById("pokemonList");

let offset=0;
const limit=20;


function newCard(info){
    
    const {sprites, id, name, types} = info;
    const urlImg = sprites.other["official-artwork"].front_default;


    cardsContainer.innerHTML+=`
        <div class="card-pokemon" data-pokemon-id=${id}>
            <div class="pokemon-image">
                <img src=${urlImg} alt=${name} srcset="">
            </div>
            <div class="pokemon-info">
                <div class="name-container">
                    <p class="pokemon-id">N°${id}</p>
                    <h2 class="pokemon-name">${name}</h2>
                </div>
                <div class="pokemon-types" id="types-${name}">
                </div>
            </div>
        </div>
    `
    const pokemonTypes = document.getElementById(`types-${name}`);
    for(let index of types){
        pokemonTypes.innerHTML+=`<p class="${index.type.name} type">${index.type.name}</p>`
    }
    
}



const getInfoPokemon = async (urlSpecies) =>{
    try {
        const response = await fetch(urlSpecies);
        const {varieties, name} = await response.json();
        for(let v of varieties){
            const {pokemon} = v;
            if(name==pokemon.name){
                const responseInfo = await fetch(pokemon.url);
                const info = await responseInfo.json();

                newCard(info);
            }
        }

    } catch (error) {
        console.error(error);
    }
}

const getAllPokemon = async (initial=0)=>{
    
    cardsContainer.innerHTML='';
    cardsContainer.classList.add('cards-container');

    try {
        //https://pokeapi.co/api/v2/pokemon-species?offset=30&limit=9
        const response = await fetch(apiUrl+`?offset=${initial}&limit=${limit}`);
        const {results } = await response.json();
        console.log(results);
        
        for(let pokemon of results){
            const urlImg = getInfoPokemon(pokemon.url);
        }
        
    } catch (error) {
        console.error(error);
    }
}


getAllPokemon(0);



function newCardDetails(info){
    
    const {sprites, id, name, types, stats, abilities} = info;
    const urlImg = sprites.other["official-artwork"].front_default;

    paginationButtons.forEach(button => {
        button.classList.add('hidden');
    });
    cardsContainer.classList.remove('cards-container');
    cardsContainer.classList.add('cards-container-detail');
    cardsContainer.innerHTML+=`
        <div class="card-pokemon-details" data-pokemon-id=${id}>
            <div class="pokemon-details">
                
                <div >
                    <div class="pokemon-details-image">
                        <img src=${urlImg} alt=${name} srcset="">
                    </div>
                    <div class="pokemon-details-info">
                        <div class="name-container-details">
                            <p class="pokemon-details-id">N°${id}</p>
                            <h2 class="pokemon-name">${name}</h2>
                        </div>
                        <div class="pokemon-types" id="types-${name}">
                        </div>
                    </div>
                </div>
                <div class="pokemon-stats" id="stats-${id}">
                </div>

                <div class="pokemon-stats abilities" id="abilities-${id}">
                    <h3>Habilidades</h3>
                    
                </div>
            </div>
            <div class="btn-pages-container">
                <button class="btn btn-back" onclick="backButton()">regresar</button>
            </div>
            
            
        </div>
    `
    const pokemonTypes = document.getElementById(`types-${name}`);
    for(let index of types){
        pokemonTypes.innerHTML+=`<p class="${index.type.name} type">${index.type.name}</p>`
    }

    
    const pokemonStats = document.getElementById(`stats-${id}`);
    for(let index of stats){
        pokemonStats.innerHTML+=`
        <h3>${index.stat.name}</h3>
        <p class="stat"">${index.base_stat}</p>`
    }
    
    const pokemonAbilities = document.getElementById(`abilities-${id}`);
    for(let index of abilities){
        pokemonAbilities.innerHTML+=`
        <p class="stat"">${index.ability.name}</p>`
    }

    
}

const loadPokemonDetails = async (id) => {
    const url = 'https://pokeapi.co/api/v2/pokemon/'
    const response = await fetch(url+id);
    const info = await response.json();

    newCardDetails(info);
};


cardsContainer.addEventListener('click', (event) => {
    const pokemonCard = event.target.closest('.card-pokemon')

    if (pokemonCard){
        const pokemonId = pokemonCard.dataset.pokemonId;
        cardsContainer.innerHTML='';
        loadPokemonDetails(pokemonId);
        console.log("info "+ pokemonId);
    }
});

const nextButton = async()=>{
    try {
        cardsContainer.innerHTML='';
        offset+=limit;
        getAllPokemon(offset);
    } catch (error) {
        
    }
};

const previousButton= async()=>{
    try {
        cardsContainer.innerHTML='';
        offset-=limit
        getAllPokemon(offset);
    } catch (error) {
        
    }
};

const backButton= async()=>{
    try {
        cardsContainer.innerHTML='';
        cardsContainer.classList.add('cards-container');
        cardsContainer.classList.remove('cards-container-detail');
        paginationButtons.forEach(button => {
            button.classList.remove('hidden');
        });
        getAllPokemon(offset);
    } catch (error) {
        
    }
};



//--------------------------------

