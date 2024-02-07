let pokemonRepository = (function () {
  let pokeList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let currentPokemonIndex;

  //DOM ELEMENTS
  let modalContainer = $("#modal-container");
  const searchInput = $("#searchInput");
  const pokedexList = $(".pokedex-list");
  const loadingMsg = $(".loadingMsg");
  const showModalButton = $("#show-modal");
  const searchButton = $("#searchButton");

  //ShowModal Function
  function showModal(pokemon) {
    //creates and then empty a modal container
    modalContainer.empty();

    //Style the modal
    let modal = $("<div>").addClass("modal");
    let closeButtonElement = $("<button>")
      .addClass("modal-close")
      .html($("<i>").addClass("fa-solid fa-xmark"));
    closeButtonElement.on("click", hideModal);

    //Add the pokemon name to the modal
    let pokemonTitle = $("<h3>")
      .addClass("poketitle")
      .text(capitalizeFirstLetter(pokemon.name));
    //Add the visual navigation arrows to the modal
    let pokeImgAndNavArrowsContainer = $("<div>").addClass("imgNav-container");
    let leftArrowNav = $("<p>")
      .addClass("imgNav-item arrow-left")
      .html($("<i>").addClass("fa-solid fa-chevron-left"));
    //add the pokemon image to the center of the modal
    let pokemonImage = $("<img>")
      .addClass("pokemon-img-modal imgNav-item")
      .attr("src", pokemon.imageUrl);

    let rightArrowNav = $("<p>")
      .addClass("imgNav-item arrow-right")
      .html($("<i>").addClass("fa-solid fa-chevron-right"));

    pokeImgAndNavArrowsContainer.append(
      leftArrowNav,
      pokemonImage,
      rightArrowNav
    );
    //creates a container with detailed infos to create a grid
    let infoContainer = $("<div>").addClass("info-container");

    let pokemonHeight = $("<p>").addClass("info-item");
    let heightIcon = $("<i>").addClass("fa-solid fa-ruler");
    let HeightLineBreak = $("<br>");
    pokemonHeight.append(
      heightIcon,
      HeightLineBreak,
      `${pokemon.height * 10} cm`
    );

    let pokemonWeight = $("<p>").addClass("info-item");
    let weightIcon = $("<i>").addClass("fa-solid fa-weight-hanging");
    let weightLineBreak = $("<br>");
    pokemonWeight.append(
      weightIcon,
      weightLineBreak,
      `${pokemon.weight / 10} kg`
    );

    let pokemonTypes = $("<p>").addClass("info-item");
    let typeIcon = $("<i>").addClass("fa-solid fa-star");
    let typeLineBreak = $("<br>");

    pokemonTypes.append(
      typeIcon,
      typeLineBreak,
      pokemon.types.map((type) => type.type.name).join(" <br> ")
    );

    let abilities = $("<p>").addClass("info-item");
    let skillIcon = $("<i>").addClass("fa-solid fa-circle-plus");
    let skillLineBreak = $("<br>");
    abilities.append(
      skillIcon,
      skillLineBreak,
      pokemon.abilities.map((ability) => ability.ability.name).join(" <br> ")
    );

    infoContainer.append(pokemonHeight, pokemonWeight, pokemonTypes, abilities);

    modal.append(
      closeButtonElement,
      pokeImgAndNavArrowsContainer,
      pokemonTitle,
      infoContainer
    );
    modalContainer.append(modal);
    modalContainer.addClass("is-visible");

    modalContainer.on("click", function (e) {
      if (e.target === modalContainer[0]) {
        hideModal();
      }
    });
  }

  function hideModal() {
    modalContainer.removeClass("is-visible");
  }

  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector("#modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  showModalButton.on("click", () => {
    showModal(pokemon);
  });

  //capitalizeFirstLetter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Função de pesquisa
  function searchPokemon() {
    // convert the result from the user to lowercase
    let searchTerm = searchInput.val().toLowerCase();
    //filter the list based on the search terms
    let filteredList = pokemonRepository.getAll().filter(function (pokemon) {
      return (
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.types.some((type) =>
          type.type.name.toLowerCase().includes(searchTerm)
        )
      );
    });

    // cleans the list
    pokedexList.empty();

    // add the searched pokemons to the list
    filteredList.forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  }

  // start the search
  searchButton.on("click touchstart", searchPokemon);

  //Show loading msg
  function showLoadingMsg() {
    let loadingMsgElement = $("<div>")
      .text("loading content...")
      .addClass("loadingMsg");
    $("body").append(loadingMsgElement);
  }

  //Hide loading msg
  function hideLoadedMsg() {
    loadingMsg;
    if (loadingMsg.length) {
      loadingMsg.remove();
    }
  }

  // this function adds the pokemon to the array of pokemons
  function add(pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
      pokeList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  //checks if the pokemon data is correct to add to the list
  function addVerification(pokemon) {
    if (typeof pokemon === "object" && "name" in pokemon) {
      return pokeList.push(pokemon);
    } else {
      console.log(
        `Invalid data, pokemon must be stored as an object with the keys: ${Object.keys(
          pokeList[0]
        )}.`
      );
    }
  }

  //return ALL the pokelist array
  function getAll() {
    return pokeList;
  }

  // //Add infos to the list of item
  function addListItem(pokemon) {
    let pokemonList = $(".pokedex-list");
    let col = $("<div>").addClass("poke-col");
    let listItem = $("<div>").addClass("pokebutton");
    let button = createButtonItem(pokemon);

    // Aqui você pode decidir qual variável CSS aplicar com base em algum critério
    // Por exemplo, com base no índice do Pokémon
    if (pokemonRepository.getAll().indexOf(pokemon) % 3 === 0) {
      button.css("background", "var(--btn_gradient_1)");
      listItem.css({
        background: "var(--btn_gradient_1)",
        "border-color": "var(--bordercolor1)", // Cor da borda personalizada para o primeiro estilo
      });
    } else if (pokemonRepository.getAll().indexOf(pokemon) % 3 === 1) {
      button.css("background", "var(--btn_gradient_2)");
      listItem.css({
        background: "var(--btn_gradient_2)",
        "border-color": "var(--bordercolor2)", // Cor da borda personalizada para o segundo estilo
      });
    } else {
      button.css("background", "var(--btn_gradient_3)");
      listItem.css({
        background: "var(--btn_gradient_3)",
        "border-color": "var(--bordercolor3)", // Cor da borda personalizada para o terceiro estilo
      });
    }

    listItem.append(button);
    col.append(listItem);
    pokemonList.append(listItem);

    loadDetails(pokemon).then(function () {
      let pokemonImage = $("<img>")
        .attr("src", pokemon.imageUrl)
        .addClass("pokemonImg-list");
      listItem.prepend(pokemonImage);
    });

    listItem.on("click", function () {
      showDetails(pokemon);
    });
  }

  //Creates a button for addListItem Function
  function createButtonItem(pokemon) {
    let button = $("<button>")
      .text(capitalizeFirstLetter(pokemon.name))
      .addClass("pokebutton");

    return button;
  }

  //Load the objects from the API, adding the objects to the add function, and with an ASYNC lines
  async function loadList() {
    showLoadingMsg();
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    } catch (e) {
      hideLoadedMsg();
      console.log(e);
    } finally {
      hideLoadedMsg();
    }
  }
  //Load all the details required for the user in the app from the API
  async function loadDetails(item) {
    let url = item.detailsUrl;
    try {
      const response = await fetch(url);
      const details = await response.json();
      item.name = details.name;
      item.imageUrl = details.sprites.front_default;
      item.backImageUrl = details.sprites.back_default;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types;
      item.abilities = details.abilities;
      return item;
    } catch (e) {
      hideLoadedMsg();
      console.log(e);
    }
  }

  //Show detailed infos of pokemons when there's an event
  function showDetails(pokemon) {
    currentPokemonIndex = pokemonRepository.getAll().indexOf(pokemon);
    loadDetails(pokemon).then(function () {
      console.log(pokemon);
      showModal(pokemon);
    });
  }

  //Arrow Navigation function
  function handleArrowNavigation(e) {
    let modalContainer = $("#modal-container");
    if (
      modalContainer.hasClass("is-visible") &&
      currentPokemonIndex !== undefined
    ) {
      if (e.type === "keydown") {
        // Verifica teclas de seta
        if (e.key === "ArrowLeft") {
          // Navega para o objeto anterior
          if (currentPokemonIndex > 0) {
            currentPokemonIndex--;
            showDetails(pokemonRepository.getAll()[currentPokemonIndex]);
          }
        } else if (e.key === "ArrowRight") {
          // Navega para o próximo objeto
          if (currentPokemonIndex < pokemonRepository.getAll().length - 1) {
            currentPokemonIndex++;
            showDetails(pokemonRepository.getAll()[currentPokemonIndex]);
          }
        }
      } else if (e.type === "click") {
        // check for mouse clicks
        let target = $(e.target);
        if (
          target.hasClass("arrow-left") ||
          target.closest(".arrow-left").length
        ) {
          // Navigate for the previous object
          if (currentPokemonIndex > 0) {
            currentPokemonIndex--;
            showDetails(pokemonRepository.getAll()[currentPokemonIndex]);
          }
        } else if (
          target.hasClass("arrow-right") ||
          target.closest(".arrow-right").length
        ) {
          // Navigate for the next object
          if (currentPokemonIndex < pokemonRepository.getAll().length - 1) {
            currentPokemonIndex++;
            showDetails(pokemonRepository.getAll()[currentPokemonIndex]);
          }
        }
      }
    }
  }

  $("#modal-container").on("click", handleArrowNavigation);
  window.addEventListener("keydown", handleArrowNavigation);

  return {
    add,
    getAll,
    addVerification,
    addListItem,
    showDetails,
    loadList,
    loadDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
