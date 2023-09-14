
// let pokemonList = [
//     {name: 'Bulbasaur', height: 0.7 , type:['grass','poison']},
//     {name: 'Charmander', height: 0.6 , type:'fire'},
//     {name: 'Squirtle', height: 0.5 , type:'water'},
//     {name: 'Caterpie', height:0.3 , type:'bug'},
//     {name: 'Pidgey', height:0.3 , type:['flying','normal']},
//     {name: 'Pikachu', height:0.4 , type:'electric'}
// ];



// function printPokemonList() {
//     for( let i = 0; i < pokemonList.length; i++) {
//     document.write('<p> ' +pokemonList[i].name);
    
//     if(pokemonList[i].height >= 0.6) {
//         console.log('<p> ' +pokemonList[i].name + ' Wow, that\'s a big Pokemon');
//         document.write('<p> ' +pokemonList[i].name + ' Wow, that\'s a big Pokemon');
//     } else if (pokemonList[i].height <= 0.3) {
//         console.log('<p> ' +pokemonList[i].name + ' Wow, that\'s such a small Pokemon');
//         document.write('<p> ' +pokemonList[i].name + ' Wow, that\'s a such a small Pokemon');
//     };
// };
// }
// printPokemonList();
// printPokemonList();


let pokemonRepository = (function(){
    let pokemonList = [
        {name: 'Bulbasaur', height: 0.7 , type:['grass','poison']},
        {name: 'Charmander', height: 0.6 , type:'fire'},
        {name: 'Squirtle', height: 0.5 , type:'water'},
        {name: 'Caterpie', height:0.3 , type:'bug'},
        {name: 'Pidgey', height:0.3 , type:['flying','normal']},
        {name: 'Pikachu', height:0.4 , type:'electric'}
    ];

    pokemonList.forEach(function(pokemon){
        console.log(pokemon.name);
        document.write(pokemon.name + '<p>');
    });

    function getAll(){
        return pokemonList;
    }


    function add(pokemon){
        pokemonList.push(pokemon);
    };



    return{
        getAll: getAll,
        add: add,

    }

})();
