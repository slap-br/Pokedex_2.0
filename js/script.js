let pokemonRepository = (function(){
    let pokemonList = [
        {name: 'Bulbasaur', height: 0.7 , type:['grass','poison']},
        {name: 'Charmander', height: 0.6 , type:'fire'},
        {name: 'Squirtle', height: 0.5 , type:'water'},
        {name: 'Caterpie', height:0.3 , type:'bug'},
        {name: 'Pidgey', height:0.3 , type:['flying','normal']},
        {name: 'Pikachu', height:0.4 , type:'electric'}
    ];


    function getAll(){
        return pokemonList;
    }

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon &&
            "height" in pokemon &&
            "types" in pokemon
          ) {
            return pokemonList.push(pokemon);
        } else {
            console.log(`Invalid data, pokemon must be stored as an object with the keys: ${Object.keys(pokemonList[0])}.`);
        }
    }

    function findPokemon(nameFilter){
        return pokemonRepository.getAll().filter(pokemon => pokemon.name.includes(nameFilter)).map(pokemon => pokemon.name);
    };


    function addListItem(pokemon){
        let pokeList = document.querySelector('.pokedex-list');
        let listItem = document.createElement('li');
        let buttonPoke = document.createElement('button');

        buttonPoke.innerText= `${pokemon.name}`;
        buttonPoke.classList.add('pokelist_button');
        listItem.appendChild(buttonPoke);
        pokeList.appendChild(listItem);

        addEventButton(buttonPoke, pokemon);

    }

    function addEventButton(buttonPoke, pokemon){
        buttonPoke.addEventListener('click', function(event){
            showDetails(pokemon);
        })
    }

    function showDetails(pokemon){
        console.log(pokemon);
    }


    return{
        getAll,
        add,
        findPokemon,
        addListItem,
    }
})();


console.log(pokemonRepository.getAll());

pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);

});
