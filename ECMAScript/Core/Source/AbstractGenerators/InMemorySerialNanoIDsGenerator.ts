import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import CharactersSequence from "../Internal/CharactersSequence";
import removeIrrelevantForbiddenIDsAndSortInAscendingOrder from
    "../Utils/removeIrrelevantForbiddenIDsAndSortInAscendingOrder";
import {
  createArrayOfNaturalNumbers,
  removeOneElementFromSet,
  isNull,
  isNotUndefined,
  Logger,
  InvalidParameterValueError,
  addElementsToSet
} from "@yamato-daiwa/es-extensions";
import removeElementsFromSet from "../Incubators/removeElementsFromSet";


export default abstract class InMemorySerialNanoIDsGenerator {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected series: number;
  protected mustInclude0thSeriesToIDs: boolean;

  /*
   * [ Approach ]
   * De facto, NanoID is a base-64 positional numeral system. As with a normal decimal system, the incrementing is
   *   executed from the last position, thus it is convenient to store the positions in reverse order. */
  protected reversedPositions: Array<string>;

  protected readonly issuedButUsageNotConfirmedIDs: Set<string> = new Set<string>();
  protected readonly issuedButWillNotBeUsedIDs: Set<string> = new Set<string>();
  protected readonly forbiddenIDs: Set<string> = new Set();


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected constructor(
    {
      initialPositions,
      initialSeries = 0,
      mustInclude0thSeriesToIDs = false,
      issuedButUsageNotConfirmedIDs,
      issuedButWillNotBeUsedIDs,
      forbiddenIDs
    }:
        Readonly<{
          initialPositions?: ReadonlyArray<string>;
          initialSeries?: number;
          mustInclude0thSeriesToIDs?: boolean;
          issuedButUsageNotConfirmedIDs?: ReadonlySet<string>
          issuedButWillNotBeUsedIDs?: ReadonlySet<string>;
          forbiddenIDs?: ReadonlySet<string>;
        }> =
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

      this.reversedPositions = InMemorySerialNanoIDsGenerator.generateReversedPositionsForFirstID();

    }

    this.series = initialSeries;
    this.mustInclude0thSeriesToIDs = mustInclude0thSeriesToIDs;

    this.issuedButUsageNotConfirmedIDs = new Set(issuedButUsageNotConfirmedIDs ?? []);
    this.issuedButWillNotBeUsedIDs = new Set(issuedButWillNotBeUsedIDs ?? []);

    const {
      relevantExternallyUsedIDs
    }: Readonly<{
      relevantExternallyUsedIDs: Array<string>;
      notRelevantAnymoreExternallyIssuedIDs: Array<string>;
    }> = removeIrrelevantForbiddenIDsAndSortInAscendingOrder({
      newForbiddenIDs: Array.from(forbiddenIDs ?? []),
      previouslyForbiddenIDs: new Set(),
      reversedPositions: this.reversedPositions
    });

    this.forbiddenIDs = new Set(relevantExternallyUsedIDs);

  }


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  // ━━━ TODO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  /* [ Approach ]
   * The FIRST ID must be issued without incrementing, but the checking is ID first or no may be the performance impact.
   * To avoid this, increment AFTER issuing of the ID. */
  public generateOne(): string {

    // TODO May become forbidden!
    const firstIssuedButWillNotBeUsedID: string | undefined =
        removeOneElementFromSet({
          targetSet: this.issuedButWillNotBeUsedIDs,
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

    const {
      relevantExternallyUsedIDs,
      notRelevantAnymoreExternallyIssuedIDs
    }: Readonly<{
      relevantExternallyUsedIDs: Array<string>;
      notRelevantAnymoreExternallyIssuedIDs: Array<string>;
    }> = removeIrrelevantForbiddenIDsAndSortInAscendingOrder({
      newForbiddenIDs: targetIDs,
      previouslyForbiddenIDs: this.forbiddenIDs,
      reversedPositions: this.reversedPositions
    });

    let updatedReservedPositions: Array<string> = this.reversedPositions;
    let updatedSeries: number = this.series;

    let nextID: string =
        InMemorySerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
            updatedReservedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

    while (relevantExternallyUsedIDs.includes(nextID)) {

      relevantExternallyUsedIDs.shift();

      this.increment();

      updatedReservedPositions = this.reversedPositions;
      updatedSeries = this.series;

      nextID =
          InMemorySerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
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
      newElements: relevantExternallyUsedIDs,
      mutably: true
    });

    removeElementsFromSet({
      targetSet: this.forbiddenIDs,
      elementsToDelete: notRelevantAnymoreExternallyIssuedIDs,
      mutably: true
    });

  }

  public async getForbiddenIDs(): Promise<Set<string>> {
    return Promise.resolve(new Set(this.forbiddenIDs));
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
      this.reversedPositions = InMemorySerialNanoIDsGenerator.generateReversedPositionsForFirstID();
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
