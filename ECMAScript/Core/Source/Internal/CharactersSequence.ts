import {
  uppercaseLatinCharacters,
  lowercaseLatinCharacters,
  stringifiedDigits
} from "@yamato-daiwa/es-extensions";


const CharactersSequence: ReadonlyArray<string> = [
  ...uppercaseLatinCharacters,
  ...lowercaseLatinCharacters,
  ...stringifiedDigits,
  "_",
  "-"
];


export default CharactersSequence;
