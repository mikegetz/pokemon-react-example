import { useQuery } from "react-query";
import { pokemonRequest, genericPokemonAPIRequest } from "../api/pokemonRequest";

const searchPokemon = async (searchValue, pokemon) => {
  const pokeState = {
    pokeImg: undefined,
    pokeName: undefined,
    pokeDescription: undefined,
    pokeDescriptionURL: undefined,
  };
  const pokemonResult = await pokemonRequest(searchValue);
  const pokemonStatus = pokemonResult.status;

  const dupe = pokemon.find((poke) => poke.pokeName === pokemonResult.data.name);
  if (dupe || pokemonStatus === 404) {
    return { pokemonStatus };
  }

  if (pokemonResult.data.name && pokemonResult.data.sprites) {
    pokeState.pokeName = pokemonResult.data.name;
    pokeState.pokeImg = pokemonResult.data.sprites.other["official-artwork"].front_default;
  }
  if (pokemonResult.data.species) {
    pokeState.pokeDescriptionURL = pokemonResult.data.species.url;
  }
  return { pokeState, pokemonStatus };
};

const VERSIONS = ["red" , "blue" , "yellow" , "gold"];

const loadDescription = async (url) => {
  const speciesResult = await genericPokemonAPIRequest(url);
  let descriptions = speciesResult.data.flavor_text_entries;
  descriptions = descriptions.filter((description) => description.language.name === "en");
  descriptions = descriptions.filter((description) => VERSIONS.includes(description.version.name));
  descriptions = descriptions.slice(0, 5);

  let parsedDescriptions = descriptions.map((description) => description.flavor_text);
  parsedDescriptions = dedup(parsedDescriptions);
  const description = cleanDescriptionsIntoDescription(parsedDescriptions);
  return description;
};


const dedup = (inputArray) => {
  return inputArray.filter((description, index) => inputArray.indexOf(description) === index);
};

const cleanDescriptionsIntoDescription = (descriptions) => {
  let parsedDescriptions = descriptions.map((description) => description.replace(/POK.MON/g, "Pokemon"));
  // eslint-disable-next-line no-control-regex
  parsedDescriptions = parsedDescriptions.map((description) => description.replace(/\u000c/u, " "));
  parsedDescriptions = parsedDescriptions.map((description) => description.replace(/\n/g, " "));
  parsedDescriptions = parsedDescriptions.map((description) => description.trim());
  const description = parsedDescriptions.join(" ");
  return description;
}

const useDescription = (descriptionURL) => {
  return useQuery(["descriptionURL", descriptionURL], () => loadDescription(descriptionURL));
};

export { useDescription, searchPokemon };
