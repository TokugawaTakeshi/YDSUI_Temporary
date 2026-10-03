import type { ComparingValuesOfArbitraryNumeralSystem } from "./compareValuesOfArbitraryNumeralSystem";
import { compareValuesOfArbitraryNumeralSystem } from "./compareValuesOfArbitraryNumeralSystem";


export default function sortValuesOfArbitraryNumeralSystem(
  values: ReadonlyArray<string>,
  positions: ReadonlyArray<string>
): Array<string> {

  return values.toSorted(
    (oneValue: string, otherValue: string): number => {

      const {
        areValueEquals,
        isFirstValueStrictlyGreater
      }: ComparingValuesOfArbitraryNumeralSystem.Result =
        compareValuesOfArbitraryNumeralSystem(
          Array.from(oneValue),
          Array.from(otherValue),
          positions
        );

      if (areValueEquals) {
        return 0;
      } else if (isFirstValueStrictlyGreater) {
        return 1;
      }


      return -1;

    }
  );

}
