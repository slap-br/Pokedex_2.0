let pokemonRepository = (function () {
  let pokeList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let currentPokemonIndex;

  //ShowModal Function
  function showModal(pokemon) {
    let modalContainer = $("#modal-container");
    modalContainer.empty();

    let modal = $("<div>").addClass("modal");
    let closeButtonElement = $("<button>")
      .addClass("modal-close")
      .html('<i class="fa-solid fa-xmark"></i>');
    closeButtonElement.on("click", hideModal);

    let pokemonTitle = $("<h1>").text(capitalizeFirstLetter(pokemon.name));

    let pokeImgAndNavArrowsContainer = $("<div>").addClass("imgNav-container");
    let leftArrowNav = $("<p>")
      .addClass("imgNav-item arrow-left")
      .html(`<i class="fa-solid fa-chevron-left"></i>`);

    let pokemonImage = $("<img>")
      .addClass("pokemon-image imgNav-item")
      .attr("src", pokemon.imageUrl);

    let rightArrowNav = $("<p>")
      .addClass("imgNav-item arrow-right")
      .html(`<i class="fa-solid fa-chevron-right"></i>`);

    pokeImgAndNavArrowsContainer.append(
      leftArrowNav,
      pokemonImage,
      rightArrowNav
    );

    let infoContainer = $("<div>").addClass("info-container");

    let pokemonHeight = $("<p>")
      .addClass("info-item")
      .html(`<i class="fa-solid fa-ruler"></i> <br> ${pokemon.height * 10} cm`);

    let pokemonWeight = $("<p>")
      .addClass("info-item")
      .html(
        `<i class="fa-solid fa-weight-hanging"></i> <br> ${
          pokemon.weight / 10
        } kg`
      );

    let pokemonTypes = $("<p>")
      .addClass("info-item")
      .html(
        `<i class="fa-solid fa-star"></i> <br> ${pokemon.types
          .map((type) => type.type.name)
          .join(" <br> ")}`
      );
    let allAbilities = $("<p>")
      .addClass("info-item")
      .html(
        `<i class="fa-solid fa-circle-plus"></i> <br> ${pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(" <br> ")}`
      );

    infoContainer.append(
      pokemonHeight,
      pokemonWeight,
      pokemonTypes,
      allAbilities
    );

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
    let modalContainer = $("#modal-container");
    modalContainer.removeClass("is-visible");
  }

  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector("#modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  document.querySelector("#show-modal").addEventListener("click", () => {
    showModal(pokemon);
  });

  //capitalizeFirstLetter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Show loading msg
  function showLoadingMsg() {
    let loadingMsg = $("<div>")
      .text("loading content...")
      .addClass("loadingMsg");
    $("body").append(loadingMsg);
  }

  //Hide loading msg
  function hideLoadedMsg() {
    let loadingMsg = $(".loadingMsg");
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
    let listItem = $("<div>").addClass("pokebutton");
    // Creates the button element
    let button = createButtonItem(pokemon);

    listItem.append(button);
    pokemonList.append(listItem);

    // Adds event listener to the button
    addEventListenerToButtons(button, pokemon);

    // Load the details of the Pokémon
    loadDetails(pokemon).then(function () {
      //create an element and define its src
      let pokemonImage = $("<img>").attr("src", pokemon.imageUrl);
      // Add image to the item of the list
      listItem.prepend(pokemonImage);

      // Add event click to the pokemon image
      listItem.on("click", function () {
        showDetails(pokemon);
      });
    });
  }

  //Creates a button for addListItem Function Above
  function createButtonItem(pokemon) {
    let button = $("<button>")
      .text(capitalizeFirstLetter(pokemon.name))
      .addClass("pokebutton");

    return button;
  }

  //Event listener button,
  function addEventListenerToButtons(button, pokemon) {
    button.on("click", function () {
      showDetails(pokemon);
    });
  }

  //Fetch and API, loadList() and add infos

  function loadList() {
    showLoadingMsg();
    return fetch(apiUrl)
      .then(function (response) {
        hideLoadedMsg();
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        hideLoadedMsg();
        console.log(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.name = details.name;
        item.imageUrl = details.sprites.front_default;
        item.backImageUrl = details.sprites.back_default;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
        item.abilities = details.abilities;
        return item;
      })
      .catch(function (e) {
        hideLoadedMsg();
        console.log(e);
      });
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
        // Verifica cliques do mouse
        let target = $(e.target);
        if (
          target.hasClass("arrow-left") ||
          target.closest(".arrow-left").length
        ) {
          // Navega para o objeto anterior
          if (currentPokemonIndex > 0) {
            currentPokemonIndex--;
            showDetails(pokemonRepository.getAll()[currentPokemonIndex]);
          }
        } else if (
          target.hasClass("arrow-right") ||
          target.closest(".arrow-right").length
        ) {
          // Navega para o próximo objeto
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
