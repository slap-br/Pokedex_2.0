let pokemonRepository = (function(){
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


    function getAll(){
        return pokemonList;
    };

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon
          ) {
            return pokemonList.push(pokemon);
        } else {
            console.log(`Invalid data, pokemon must be stored as an object with the keys: ${Object.keys(pokemonList[0])}.`);
        }
    };

    //reforcar esta parte da funcao de filtrar objeto por nome
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
    };

    function loadList(){
        return fetch(apiUrl).then(function (response){
            return response.json();
        }).then(function(json){
            json.results.forEach(function(item){
                let pokemon ={
                    name: item.name,
                    detailsUrl: item.url,
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        });
    };

    function loadDetails(item){
        let url = item.detailsUrl;
        return fetch(url).then(function (response){
            return response.json();
        }).then(function(details){
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = details.types;

        }).catch(function (e){
            console.error(e);
        });  
    };

    function addEventButton(buttonPoke, pokemon){
        buttonPoke.addEventListener("click", function(event){
            showDetails(pokemon);
        })
    };


    function showDetails(pokemon){
        loadDetails(pokemon).then(function(){
            console.log(pokemon);
        });
    };

    return{
        getAll,
        add,
        findPokemon,
        addListItem,
        loadList,
        loadDetails,
        showDetails,
    };
})();

// console.log(pokemonRepository.getAll());

pokemonRepository.loadList().then(function (){
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
});
});
