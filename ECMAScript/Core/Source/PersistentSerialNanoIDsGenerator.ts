import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import CharactersSequence from "./Internal/CharactersSequence";
import {
  createArrayOfNaturalNumbers,
  Logger,
  InvalidParameterValueError,
  isNotUndefined
} from "@yamato-daiwa/es-extensions";
import {
  compareValuesOfArbitraryNumeralSystem,
  type ComparingValuesOfArbitraryNumeralSystem
} from "./Incubators/compareValuesOfArbitraryNumeralSystem";
import type { SerialNanoID_Generator } from "./SerialNanoID_Generator";


abstract class PersistentSerialNanoIDsGenerator implements SerialNanoID_Generator {

  /* ━━━ Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Instance ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  protected series: number;
  protected mustInclude0thSeriesToIDs: boolean;

  /*
   * [ Approach ]
   * De facto, NanoID is a base-64 positional numeral system. As with a normal decimal system, the incrementing is
   *   executed from the last position; thus it is convenient to store the positions in reverse order. */
  protected reversedPositions: Array<string>;

  protected notSynchronizedIDsProhibitionOfWhichNoLongerRelevant: Array<string> = [];


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected constructor(
    {
      initialPositions,
      initialSeries = 0,
      mustInclude0thSeriesToIDs = false
    }: SerialNanoID_Generator.Options
        = {}
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

      this.reversedPositions = PersistentSerialNanoIDsGenerator.generateReversedPositionsForFirstID();

    }

    this.series = initialSeries;
    this.mustInclude0thSeriesToIDs = mustInclude0thSeriesToIDs;

  }


  /* ┅┅┅ Abstract Methods ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Public ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */

  public abstract reportSuccessfulUsageOfIssuedIDs(targetIDs: ReadonlyArray<string>): Promise<void>;

  public abstract reportHasBecomeUnnecessaryIDs(targetIDs: ReadonlyArray<string>): Promise<void>;


  /* ─── Forbidden IDs ────────────────────────────────────────────────────────────────────────────────────────────── */
  /* [ Approach ] The number of these IDs can be arbitrary large, so should NOT store them in RAM. */

  /** @description No internal usages. Only for usage on demand. */
  protected abstract registerForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void>;

  public abstract isID_Forbidden(targetID: string): Promise<boolean>;

  public abstract deleteForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void>;


  /* ╍╍╍ Protected ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */

  /** @description Being internally used for the reissuing of IDs which declared as will not be used. */
  protected abstract removeThenGetIssuedButHasBecomeUnnecessaryIDs(maximalQuantity: number): Promise<Array<string>>;

  protected abstract registerIssuedButNotUsedYetIDs(targetIDs: ReadonlyArray<string>): Promise<void>;


  /* ─── Synchronization ──────────────────────────────────────────────────────────────────────────────────────────── */

  protected abstract synchronizeReversedPositions(): Promise<void>;

  protected abstract synchronizeSeries(): Promise<void>;


  /* ━━━ Public Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public async generateOne(): Promise<string> {

    const firstIssuedButWillNotBeUsedID: string | undefined = (await this.removeThenGetIssuedButHasBecomeUnnecessaryIDs(1))[0];

    // TODO May become forbidden!
    if (isNotUndefined(firstIssuedButWillNotBeUsedID)) {

      await this.registerIssuedButNotUsedYetIDs([ firstIssuedButWillNotBeUsedID ]);

      return firstIssuedButWillNotBeUsedID;

    }


    const newID: string = await this.issueID_FromReversedPositionsOnly({ mustSynchronizeData: true });

    await this.registerIssuedButNotUsedYetIDs([ newID ]);

    return newID;

  }

  public async generateMultipleOnes(count: number): Promise<Array<string>> {

    // TODO May become forbidden!
    const issuedButWillNotBeUsedIDs: Array<string> = await this.removeThenGetIssuedButHasBecomeUnnecessaryIDs(count);

    const numberOfIDsMustBeGenerated: number = count - issuedButWillNotBeUsedIDs.length;

    if (numberOfIDsMustBeGenerated === 0) {
      await this.registerIssuedButNotUsedYetIDs(issuedButWillNotBeUsedIDs);
      return issuedButWillNotBeUsedIDs;
    }


    const seriesBeforeIssuingOfIDs: number = this.series;

    const demandedIDs: Array<string> = [ ...issuedButWillNotBeUsedIDs ];

    /* [ Approach ]
     * With `{ mustSynchronizeData: false }`, the only async asynchronous during the invocation of
     *   `issueID_FromReversedPositionsOnly` is the checking for the forbidden IDs so it is enough safe
     *   to use the parallelism.  */
    await Promise.all(
      createArrayOfNaturalNumbers({ elementsCount: numberOfIDsMustBeGenerated }).
          map(
            async (): Promise<void> => {
              demandedIDs.push(
                await this.issueID_FromReversedPositionsOnly({ mustSynchronizeData: false })
              );
            }
          )
    );

    await Promise.all([
      this.registerIssuedButNotUsedYetIDs(demandedIDs),
      this.synchronizeReversedPositions(),
      ...seriesBeforeIssuingOfIDs === this.series ? [] : [ this.synchronizeSeries() ],
      ...this.notSynchronizedIDsProhibitionOfWhichNoLongerRelevant.length > 0 ?
          [
            this.deleteForbiddenIDs(this.notSynchronizedIDsProhibitionOfWhichNoLongerRelevant).
                then(
                  (): void =>
                      { this.notSynchronizedIDsProhibitionOfWhichNoLongerRelevant = []; }
                )
          ] :
          []
    ]);

    return demandedIDs;

  }

  public async reportExternallyIssuedUsageOfIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

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

                return mustKeepID

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
        PersistentSerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
            updatedReservedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

    let mustUpdateReversedPositions: boolean = false;

    while (actualExternallyUsedIDs.includes(nextID)) {

      mustUpdateReversedPositions = true;

      actualExternallyUsedIDs.shift();

      const incrementingResult: PersistentSerialNanoIDsGenerator.IncrementingResult =
          PersistentSerialNanoIDsGenerator.
              computeIncrementedPositionsAndSeriesWithoutCheckingForForbiddenIDs(updatedReservedPositions, updatedSeries);

      updatedReservedPositions = incrementingResult.updatedReversedPositions;
      updatedSeries = incrementingResult.updatedSeries;

      nextID =
          PersistentSerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
            updatedReservedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

    }


    if (mustUpdateReversedPositions) {
      this.reversedPositions = updatedReservedPositions;
    }

    const mustUpdateSeries: boolean = this.series !== updatedSeries;

    if (mustUpdateSeries) {
      this.series = updatedSeries;
    }

    await Promise.all([
      ...mustUpdateReversedPositions ? [] : [ this.synchronizeReversedPositions() ],
      ...mustUpdateSeries ? [] : [ this.synchronizeSeries() ],
      ...actualExternallyUsedIDs.length > 0 ? [ this.registerForbiddenIDs(actualExternallyUsedIDs) ] : [],
      ...notActualAnymoreExternallyIssuedIDs.length > 0 ? [ this.deleteForbiddenIDs(notActualAnymoreExternallyIssuedIDs) ] : []
    ]);

  }


  /* ━━━ Protected Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* [ Approach ]
   * The FIRST ID must be issued without incrementing, but the checking is ID first or no may be the performance impact.
   * To avoid this, increment AFTER issuing of the ID. */
  protected async issueID_FromReversedPositionsOnly(
    { mustSynchronizeData }: Readonly<{ mustSynchronizeData: boolean; }>
  ): Promise<string> {

    let newID: string =
        PersistentSerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
          this.reversedPositions,
          this.series,
          this.mustInclude0thSeriesToIDs
        );

    let {
      updatedReversedPositions,
      updatedSeries
    }: PersistentSerialNanoIDsGenerator.IncrementingResult =
        PersistentSerialNanoIDsGenerator.
            computeIncrementedPositionsAndSeriesWithoutCheckingForForbiddenIDs(this.reversedPositions, this.series);

    const passedForbiddenIDs: Array<string> = [];

    /* eslint-disable-next-line no-await-in-loop -- Checking of each new ID on demand. */
    while (await this.isID_Forbidden(newID)) {

      passedForbiddenIDs.push(newID);

      newID =
          PersistentSerialNanoIDsGenerator.generateID_BasedOnInMemoryDataOnly(
            updatedReversedPositions,
            updatedSeries,
            this.mustInclude0thSeriesToIDs
          );

      const incrementingResult: PersistentSerialNanoIDsGenerator.IncrementingResult =
          PersistentSerialNanoIDsGenerator.
              computeIncrementedPositionsAndSeriesWithoutCheckingForForbiddenIDs(updatedReversedPositions, updatedSeries);

      updatedReversedPositions = incrementingResult.updatedReversedPositions;
      updatedSeries = incrementingResult.updatedSeries;

    }

    this.reversedPositions = updatedReversedPositions;
    this.series = updatedSeries;

    if (mustSynchronizeData) {

      await Promise.all([
        this.synchronizeReversedPositions(),
        ...this.series === updatedSeries ? [] : [ this.synchronizeSeries() ],
        ...passedForbiddenIDs.length > 0 ? [] : [ this.deleteForbiddenIDs(passedForbiddenIDs) ]
      ]);

    } else {

      this.notSynchronizedIDsProhibitionOfWhichNoLongerRelevant = passedForbiddenIDs;

    }

    return newID;

  }

  protected static computeIncrementedPositionsAndSeriesWithoutCheckingForForbiddenIDs(
    reversedPositions: ReadonlyArray<string>, series: number
  ): PersistentSerialNanoIDsGenerator.IncrementingResult {

    let isIncrementingOfNextPositionRequired: boolean = false;
    let updatedReversedPositions: Array<string> = [ ...reversedPositions ];

    for (const [ positionIndex, position ] of reversedPositions.entries()) {

      const indexOfCurrentCharacterInSequence: number = CharactersSequence.indexOf(position);
      const indexOfNextCharacterInSequence: number =
          indexOfCurrentCharacterInSequence === CharactersSequence.length - 1 ?
              0 : indexOfCurrentCharacterInSequence + 1;

      isIncrementingOfNextPositionRequired = indexOfNextCharacterInSequence === 0;

      updatedReversedPositions[positionIndex] = CharactersSequence[indexOfNextCharacterInSequence];

      if (!isIncrementingOfNextPositionRequired) {
        return {
          updatedReversedPositions,
          updatedSeries: series
        };
      }

    }

    if (isIncrementingOfNextPositionRequired) {
      updatedReversedPositions = PersistentSerialNanoIDsGenerator.generateReversedPositionsForFirstID();
    }

    return {
      updatedReversedPositions,
      updatedSeries: isIncrementingOfNextPositionRequired ? series + 1 : series
    };

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
    /* eslint-disable @stylistic/array-element-newline -- Allow 5 element per row for readability. */
    return [
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A", "A", "A", "A", "A",
      "A"
    ];
    /* eslint-enable @stylistic/array-element-newline */
  }

}


namespace PersistentSerialNanoIDsGenerator {

  export type IncrementingResult = Readonly<{
    updatedReversedPositions: Array<string>;
    updatedSeries: number;
  }>;

}


export default PersistentSerialNanoIDsGenerator;
