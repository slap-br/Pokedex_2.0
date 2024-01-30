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
    let pokemonImage = $("<img>")
      .addClass("pokemon-image")
      .attr("src", pokemon.imageUrl);

    let infoContainer = $("<div>").addClass("info-container");

    let pokemonHeight = $("<p>")
      .addClass("info-item")
      .html(
        `<i class="fa-solid fa-arrow-up"></i> <br> ${pokemon.height * 10} cm`
      );
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
    modal.append(closeButtonElement, pokemonImage, pokemonTitle, infoContainer);
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
    if (loadingMsg.lenght) {
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
      listItem.append(pokemonImage);

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
      if (e.key === "ArrowLeft") {
        // Nav to the previous object
        if (currentPokemonIndex > 0) {
          showDetails(pokemonRepository.getAll()[currentPokemonIndex - 1]);
        }
      } else if (e.key === "ArrowRight") {
        // Nav to the next object
        if (currentPokemonIndex < pokemonRepository.getAll().length - 1) {
          showDetails(pokemonRepository.getAll()[currentPokemonIndex + 1]);
        }
      }
    }
  }

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

// codigo antigo funcionando SEM JQUERY

// let pokemonRepository = (function () {
//   let pokeList = [];
//   let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
//   let currentPokemonIndex;

//   //ShowModal Function
//   function showModal(pokemon) {
//     let modalContainer = document.querySelector("#modal-container");
//     // clear todo content do modal
//     modalContainer.innerHTML = "";

//     let modal = document.createElement("div");
//     modal.classList.add("modal");
//     // add the new content to the modal
//     let closeButtonElement = document.createElement("button");
//     closeButtonElement.classList.add("modal-close");
//     closeButtonElement.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
//     closeButtonElement.addEventListener("click", hideModal);

//     let pokemonTitle = document.createElement("h1");
//     pokemonTitle.innerText = capitalizeFirstLetter(pokemon.name);

//     let pokemonImage = document.createElement("img");
//     pokemonImage.classList.add("pokemon-image");
//     pokemonImage.src = pokemon.imageUrl;

//     let infoContainer = document.createElement("div");
//     infoContainer.classList.add("info-container");

//     let pokemonHeight = document.createElement("p");
//     pokemonHeight.classList.add("info-item");
//     pokemonHeight.innerHTML = `<i class="fa-solid fa-arrow-up"></i> <br> ${
//       pokemon.height * 10
//     } cm`;

//     let pokemonWeight = document.createElement("p");
//     pokemonWeight.classList.add("info-item");
//     pokemonWeight.innerHTML = `<i class="fa-solid fa-weight-hanging"></i> <br> ${
//       pokemon.weight / 10
//     } kg`;

//     let pokemonTypes = document.createElement("p");
//     pokemonTypes.classList.add("info-item");
//     pokemonTypes.innerHTML = `<i class="fa-solid fa-star"></i> <br> ${pokemon.types
//       .map((type) => type.type.name)
//       .join(" <br> ")}`;

//     let allAbilities = document.createElement("p");
//     allAbilities.classList.add("info-item");
//     allAbilities.innerHTML = `<i class="fa-solid fa-circle-plus"></i> <br> ${pokemon.abilities
//       .map((ability) => ability.ability.name)
//       .join(" <br> ")}`;

//     infoContainer.appendChild(pokemonHeight);
//     infoContainer.appendChild(pokemonWeight);
//     infoContainer.appendChild(pokemonTypes);
//     infoContainer.appendChild(allAbilities);

//     modal.appendChild(closeButtonElement);
//     modal.appendChild(pokemonImage);
//     modal.appendChild(pokemonTitle);
//     modal.appendChild(infoContainer);
//     modalContainer.appendChild(modal);

//     modalContainer.classList.add("is-visible");

//     modalContainer.addEventListener("click", (e) => {
//       let target = e.target;
//       if (target === modalContainer) {
//         hideModal();
//       }
//     });
//   }

//   function hideModal() {
//     let modalContainer = document.querySelector("#modal-container");
//     modalContainer.classList.remove("is-visible");
//   }

//   window.addEventListener("keydown", (e) => {
//     let modalContainer = document.querySelector("#modal-container");
//     if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
//       hideModal();
//     }
//   });

//   document.querySelector("#show-modal").addEventListener("click", () => {
//     showModal(pokemon);
//   });

//   //capitalizeFirstLetter
//   function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
//   }

//   //Show loading msg
//   function showLoadingMsg() {
//     let loadingMsg = document.createElement("div");
//     loadingMsg.innerText = "loading content...";
//     loadingMsg.classList.add("loadingMsg");
//     document.body.appendChild(loadingMsg);
//   }

//   //Hide loading msg
//   function hideLoadedMsg() {
//     let loadingMsg = document.querySelector(".loadingMsg");
//     if (loadingMsg) {
//       loadingMsg.remove();
//     }
//   }

//   // this function adds the pokemon to the array of pokemons
//   function add(pokemon) {
//     if (typeof pokemon === "object" && "name" in pokemon) {
//       pokeList.push(pokemon);
//     } else {
//       console.log("pokemon is not correct");
//     }
//   }

//   //checks if the pokemon data is correct to add to the list
//   function addVerification(pokemon) {
//     if (typeof pokemon === "object" && "name" in pokemon) {
//       return pokeList.push(pokemon);
//     } else {
//       console.log(
//         `Invalid data, pokemon must be stored as an object with the keys: ${Object.keys(
//           pokeList[0]
//         )}.`
//       );
//     }
//   }

//   //return ALL the pokelist array
//   function getAll() {
//     return pokeList;
//   }

//   // //Add infos to the list of item
//   function addListItem(pokemon) {
//     let pokemonList = document.querySelector(".pokedex-list");
//     let listItem = document.createElement("div");
//     listItem.classList.add("pokebutton");

//     // Creates the button element
//     let button = createButtonItem(pokemon);

//     listItem.appendChild(button);
//     pokemonList.appendChild(listItem);

//     // Adds event listener to the button
//     addEventListenerToButtons(button, pokemon);

//     // Load the details of the Pokémon
//     loadDetails(pokemon).then(function () {
//       //create an element and define its src
//       let pokemonImage = document.createElement("img");
//       pokemonImage.src = pokemon.imageUrl;

//       // Add image to the item of the list
//       listItem.appendChild(pokemonImage);

//       // Add event click to the pokemon image
//       listItem.addEventListener("click", function () {
//         showDetails(pokemon);
//       });
//     });
//   }

//   //Creates a button for addListItem Function Above
//   function createButtonItem(pokemon) {
//     let button = document.createElement("button");
//     button.innerText = capitalizeFirstLetter(pokemon.name);
//     button.classList.add("pokebutton");

//     return button;
//   }

//   //Event listener button,
//   function addEventListenerToButtons(button, pokemon) {
//     button.addEventListener("click", function () {
//       showDetails(pokemon);
//     });
//   }

//   //Fetch and API, loadList() and add infos

//   function loadList() {
//     showLoadingMsg();
//     return fetch(apiUrl)
//       .then(function (response) {
//         hideLoadedMsg();
//         return response.json();
//       })
//       .then(function (json) {
//         json.results.forEach(function (item) {
//           let pokemon = {
//             name: item.name,
//             detailsUrl: item.url,
//           };
//           add(pokemon);
//         });
//       })
//       .catch(function (e) {
//         hideLoadedMsg();
//         console.log(e);
//       });
//   }

//   function loadDetails(item) {
//     let url = item.detailsUrl;
//     return fetch(url)
//       .then(function (response) {
//         return response.json();
//       })
//       .then(function (details) {
//         item.name = details.name;
//         item.imageUrl = details.sprites.front_default;
//         item.backImageUrl = details.sprites.back_default;
//         item.height = details.height;
//         item.weight = details.weight;
//         item.types = details.types;
//         item.abilities = details.abilities;
//         return item;
//       })
//       .catch(function (e) {
//         hideLoadedMsg();
//         console.log(e);
//       });
//   }

//   //Show detailed infos of pokemons when there's an event
//   function showDetails(pokemon) {
//     currentPokemonIndex = pokemonRepository.getAll().indexOf(pokemon);
//     loadDetails(pokemon).then(function () {
//       console.log(pokemon);
//       showModal(pokemon);
//     });
//   }

//   //Arrow Navigation function
//   function handleArrowNavigation(e) {
//     let modalContainer = document.querySelector("#modal-container");
//     if (
//       modalContainer.classList.contains("is-visible") &&
//       currentPokemonIndex !== undefined
//     ) {
//       if (e.key === "ArrowLeft") {
//         // Nav to the previous object
//         if (currentPokemonIndex > 0) {
//           showDetails(pokemonRepository.getAll()[currentPokemonIndex - 1]);
//         }
//       } else if (e.key === "ArrowRight") {
//         // Nav to the next object
//         if (currentPokemonIndex < pokemonRepository.getAll().length - 1) {
//           showDetails(pokemonRepository.getAll()[currentPokemonIndex + 1]);
//         }
//       }
//     }
//   }

//   window.addEventListener("keydown", handleArrowNavigation);

//   return {
//     add,
//     getAll,
//     addVerification,
//     addListItem,
//     showDetails,
//     loadList,
//     loadDetails,
//   };
// })();

// pokemonRepository.loadList().then(function () {
//   pokemonRepository.getAll().forEach(function (pokemon) {
//     pokemonRepository.addListItem(pokemon);
//   });
// });
