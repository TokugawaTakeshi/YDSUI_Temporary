import CharactersSequence from "../Internal/CharactersSequence";
import {
  compareValuesOfArbitraryNumeralSystem,
  type ComparingValuesOfArbitraryNumeralSystem
} from "../Incubators/compareValuesOfArbitraryNumeralSystem";


export default function removeIrrelevantForbiddenIDsAndSortInAscendingOrder(
  {
    newForbiddenIDs,
    previouslyForbiddenIDs,
    reversedPositions
  }: Readonly<{
    newForbiddenIDs: ReadonlyArray<string>;
    previouslyForbiddenIDs: ReadonlySet<string>;
    reversedPositions: ReadonlyArray<string>;
  }>
): Readonly<{
  relevantExternallyUsedIDs: Array<string>;
  notRelevantAnymoreExternallyIssuedIDs: Array<string>;
}> {

  const notRelevantAnymoreExternallyIssuedIDs: Array<string> = [];

  const relevantExternallyUsedIDs: Array<string> =

      Array.from(new Set(newForbiddenIDs)).

            filter(
              (ID: string): boolean => {

                if (previouslyForbiddenIDs.has(ID)) {
                  return false;
                }


                const mustKeepID: boolean =
                    compareValuesOfArbitraryNumeralSystem(
                      Array.from(ID),
                      reversedPositions,
                      CharactersSequence
                    ).
                        isFirstValueGreaterOrEqualsToSecondOne;

                if (!mustKeepID) {
                  notRelevantAnymoreExternallyIssuedIDs.push(ID);
                }

                return mustKeepID;

              }

            ).

            toSorted(
              (oneID: string, otherID: string): number => {

                const {
                  isFirstValueStrictlySmaller
                }: ComparingValuesOfArbitraryNumeralSystem.Result =

                    compareValuesOfArbitraryNumeralSystem(
                      Array.from(oneID),
                      Array.from(otherID),
                      CharactersSequence
                    );

                return isFirstValueStrictlySmaller ? -1 : 1;

              }
            );

  return {
    relevantExternallyUsedIDs,
    notRelevantAnymoreExternallyIssuedIDs
  };

}
