import { Logger, UnexpectedEventError } from "@yamato-daiwa/es-extensions";
import removeElementsFromSet from "./removeElementsFromSet";


export namespace RemovingAndGettingOfSpecificNumberElementsFromSet {

  export type Result<ElementOfSet> = Readonly<{
    removedElements: Array<ElementOfSet>;
    updatedSet: Set<ElementOfSet>;
  }>;

}


export default function removeThenGetSpecificNumberOfSetElements<ElementOfSet>(
  {
    targetSet,
    elementsCount,
    mustThrowErrorIfSetHasLessElementsThanSpecified,
    mutably
  }: Readonly<
    {
      elementsCount: number;
      mustThrowErrorIfSetHasLessElementsThanSpecified: boolean;
    } &
    (
      {
        mutably?: true;
        targetSet: Set<ElementOfSet>;
      } |
      {
        mutably: false;
        targetSet: ReadonlySet<ElementOfSet>;
      }
    )
  >
): RemovingAndGettingOfSpecificNumberElementsFromSet.Result<ElementOfSet> {

  const workpiece: Array<ElementOfSet> = Array.from(targetSet);

  if (elementsCount < workpiece.length && mustThrowErrorIfSetHasLessElementsThanSpecified) {
    Logger.throwErrorWithFormattedMessage({
      errorInstance:
          new UnexpectedEventError(
            `Target set has ${ workpiece.length } elements while at least ${ elementsCount } expected.`
          ),
      title: UnexpectedEventError.localization.defaultTitle,
      occurrenceLocation: "deleteElementsFromSet(compoundParameter)"
    });
  }


  const removedElements: Array<ElementOfSet> = workpiece.slice(0, elementsCount);

  if (mutably === true) {
    return {
      removedElements,
      updatedSet: removeElementsFromSet({ targetSet, elementsToDelete: removedElements, mutably: true })
    };
  }


  return {
    removedElements: workpiece.slice(0, elementsCount),
    updatedSet: new Set(workpiece.slice(elementsCount))
  };

}
