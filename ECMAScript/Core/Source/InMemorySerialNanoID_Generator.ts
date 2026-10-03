import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import CharactersSequence from "./Internal/CharactersSequence";
import {
  createArrayOfNaturalNumbers,
  removeOneElementFromSet,
  isNull,
  isNotUndefined,
  Logger,
  InvalidParameterValueError,
  addElementsToSet
} from "@yamato-daiwa/es-extensions";
import {
  compareValuesOfArbitraryNumeralSystem,
  ComparingValuesOfArbitraryNumeralSystem
} from "./Incubators/compareValuesOfArbitraryNumeralSystem";
import removeElementsFromSet from "./Incubators/removeElementsFromSet";
import type { SerialNanoID_Generator } from "./SerialNanoID_Generator";


abstract class InMemorySerialNanoID_Generator implements SerialNanoID_Generator {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected series: number;
  protected mustInclude0thSeriesToIDs: boolean;

  /*
   * [ Approach ]
   * De facto, NanoID is a base-64 positional numeral system. As with a normal decimal system, the incrementing is
   *   executed from the last position, thus it is convenient to store the positions in reverse order. */
  protected reversedPositions: Array<string>;

  protected readonly issuedButUsageNotConfirmedIDs: Set<string> = new Set<string>();
  protected readonly issuedButHasBecomeUnnecessaryIDs: Set<string> = new Set<string>();
  protected readonly forbiddenIDs: Set<string> = new Set();


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected constructor(
    {
      initialPositions,
      initialSeries = 0,
      mustInclude0thSeriesToIDs = false,
      issuedButUsageNotConfirmedIDs,
      issuedButHasBecomeUnnecessaryIDs,
      forbiddenIDs
    }:
        InMemorySerialNanoID_Generator.Options =
            {}
  ) {

    if (isNotUndefined(initialPositions)) {

      if (initialPositions.length !== FIXED_CHARACTERS_COUNT_IN_NANO_ID) {

        Logger.throwErrorWithFormattedMessage({
          errorInstance: new InvalidParameterValueError({
            parameterNumber: 1,
            parameterName: "options",
            customMessage:
                `If \`initialPositions\` array has been specified, it must have exactly 
                    ${ FIXED_CHARACTERS_COUNT_IN_NANO_ID } characters.`
          }),
          title: InvalidParameterValueError.localization.defaultTitle,
          occurrenceLocation: "SerialNanoID.constructor(options)"
        });

      }

      this.reversedPositions = initialPositions.toReversed();

    } else {

      this.reversedPositions = InMemorySerialNanoID_Generator.generateReversedPositionsForFirstID();

    }

    this.series = initialSeries;
    this.mustInclude0thSeriesToIDs = mustInclude0thSeriesToIDs;

    this.issuedButUsageNotConfirmedIDs = new Set(...issuedButUsageNotConfirmedIDs ?? []);
    this.issuedButHasBecomeUnnecessaryIDs = new Set(issuedButHasBecomeUnnecessaryIDs ?? []);
    this.forbiddenIDs = new Set(forbiddenIDs ?? []);

  }


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // ━━━ TODO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  /* [ Approach ]
   * The FIRST ID must be issued without incrementing, but the checking is ID first or no may be the performance impact.
   * To avoid this, increment AFTER issuing of the ID. */
  public generateOne(): string {

    // TODO May becore forbidden!
    const firstIssuedButWillNotBeUsedID: string | undefined =
        removeOneElementFromSet({
          targetSet: this.issuedButHasBecomeUnnecessaryIDs,
          mutably: true,
          mustThrowErrorIfSetIsEmpty: false
        }).
            removedElement;

    if (isNotUndefined(firstIssuedButWillNotBeUsedID)) {
      return firstIssuedButWillNotBeUsedID;
    }


    let newID: string;
    let isNewID_Forbidden: boolean;

    do {

      newID =
          [
            ...this.series === 0 && !this.mustInclude0thSeriesToIDs ? [] : [ this.series ],
            this.reversedPositions.toReversed().join("")
          ].
              join("~");

      isNewID_Forbidden = this.forbiddenIDs.has(newID);

      if (isNewID_Forbidden) {
        this.forbiddenIDs.delete(newID);
      }

      this.increment();

    } while (isNewID_Forbidden);

    this.issuedButUsageNotConfirmedIDs.add(newID);

    return newID;

  }

  public generateMultipleOnes(count: number): Array<string> {
    return createArrayOfNaturalNumbers({ elementsCount: count }).map(this.generateOne.bind(this));
  }

  public reportExternallyIssuedUsageOfIDs(targetIDs: ReadonlyArray<string>): void {

    const notActualAnymoreExternallyIssuedIDs: Array<string> = [];

    const actualExternallyUsedIDs: Array<string> =

        Array.from(new Set(targetIDs)).

            filter(
              (ID: string): boolean => {

                const mustKeepID: boolean =
                    compareValuesOfArbitraryNumeralSystem(
                      Array.from(ID),
                      this.reversedPositions,
                      CharactersSequence
                    ).
                        isFirstValueGreaterOrEqualsToSecondOne;

                if (!mustKeepID) {
                  notActualAnymoreExternallyIssuedIDs.push(ID);
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

    let updatedReservedPositions: Array<string> = this.reversedPositions;
    let updatedSeries: number = this.series;

    let nextID: string =
        InMemorySerialNanoID_Generator.generateID_BasedOnInMemoryDataOnly(
            updatedReservedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

    while (actualExternallyUsedIDs.includes(nextID)) {

      actualExternallyUsedIDs.shift();

      this.increment();

      updatedReservedPositions = this.reversedPositions;
      updatedSeries = this.series;

      nextID =
          InMemorySerialNanoID_Generator.generateID_BasedOnInMemoryDataOnly(
            updatedReservedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

    }

    this.reversedPositions = updatedReservedPositions;

    const mustUpdateSeries: boolean = this.series !== updatedSeries;

    if (mustUpdateSeries) {
      this.series = updatedSeries;
    }

    addElementsToSet({
      targetSet: this.forbiddenIDs,
      newElements: actualExternallyUsedIDs,
      mutably: true
    });

    removeElementsFromSet({
      targetSet: this.forbiddenIDs,
      elementsToDelete: notActualAnymoreExternallyIssuedIDs,
      mutably: true
    });

  }


  /* ━━━ Protected Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected increment(): void {

    let isIncrementOfNextPositionRequired: boolean = true;

    for (const [ positionIndex, position ] of this.reversedPositions.entries()) {

      const indexOfCurrentCharacterInSequence: number = CharactersSequence.indexOf(position);
      const indexOfNextCharacterInSequence: number =
          indexOfCurrentCharacterInSequence === CharactersSequence.length - 1 ?
              0 : indexOfCurrentCharacterInSequence + 1;

      isIncrementOfNextPositionRequired = indexOfNextCharacterInSequence === 0;

      this.reversedPositions[positionIndex] = CharactersSequence[indexOfNextCharacterInSequence];

      if (!isIncrementOfNextPositionRequired) {
        return;
      }

    }


    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition --
    * Looks like the ESLint bug because `isIncrementOfNextPositionRequired` is changed inside the loop. */
    if (isIncrementOfNextPositionRequired) {
      this.series = isNull(this.series) ? 0 : this.series + 1;
      this.reversedPositions = InMemorySerialNanoID_Generator.generateReversedPositionsForFirstID();
    }

  }

  protected static generateID_BasedOnInMemoryDataOnly(
    reversedPositions: ReadonlyArray<string>,
    series: number,
    mustInclude0thSeriesToIDs: boolean
  ): string {
    return [
      ...series === 0 && !mustInclude0thSeriesToIDs ? [] : [ series ],
      reversedPositions.toReversed().join("")
    ].
        join("~");
  }

  protected static generateReversedPositionsForFirstID(): Array<string> {
    return [
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A"
    ];
  }

}


namespace InMemorySerialNanoID_Generator {

  export type Options =
      SerialNanoID_Generator.Options &
      Readonly<{
        issuedButUsageNotConfirmedIDs?: ReadonlySet<string>;
        issuedButHasBecomeUnnecessaryIDs?: ReadonlySet<string>;
        forbiddenIDs?: ReadonlySet<string>;
      }>;

}


export default InMemorySerialNanoID_Generator;

