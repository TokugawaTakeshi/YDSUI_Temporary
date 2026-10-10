import type { TestableSerialNanoIDsGenerator} from "../../Source";
import { PersistentSerialNanoIDsGenerator } from "../../Source";
import { addElementsToSet } from "@yamato-daiwa/es-extensions";
import removeElementsFromSet from "../../Source/Incubators/removeElementsFromSet";
import removeThenGetSpecificNumberOfSetElements from "../../Source/Incubators/removeThenGetSpecificNumberOfSetElements";
import removeIrrelevantForbiddenIDsAndSortInAscendingOrder
  from "../../Source/Utils/removeIrrelevantForbiddenIDsAndSortInAscendingOrder";


export default class TestablePersistentSerialNanoIDsGenerator
    extends PersistentSerialNanoIDsGenerator
    implements TestableSerialNanoIDsGenerator
{

  /* [ Theory ] Has been made public only for testing purposes. */
  public readonly forbiddenIDs: Set<string> = new Set<string>();

  protected readonly issuedButUsageNotConfirmedIDs: Set<string> = new Set<string>();
  protected readonly issuedButWillNotBeUsedIDs: Set<string>;


  public constructor(
    {
      issuedButWillNotBeUsedIDs = new Set(),
      forbiddenIDs,
      ...parentClassOptions
    }:
        TestableSerialNanoIDsGenerator.Options =
            {}
  ) {

    super(parentClassOptions);

    this.issuedButWillNotBeUsedIDs = new Set(issuedButWillNotBeUsedIDs);

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


  public async reportSuccessfulUsageOfIssuedIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

    removeElementsFromSet({
      targetSet: this.issuedButUsageNotConfirmedIDs,
      elementsToDelete: targetIDs,
      mutably: true
    });

    return Promise.resolve();

  }

  public async reportHasBecomeUnnecessaryIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

    removeElementsFromSet({
      targetSet: this.issuedButWillNotBeUsedIDs,
      elementsToDelete: targetIDs,
      mutably: true
    });

    return Promise.resolve();

  }

  public async registerForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

    addElementsToSet({
      targetSet: this.forbiddenIDs,
      newElements: targetIDs,
      mutably: true
    });

    return Promise.resolve();

  }

  protected async whichIDsForbidden(targetIDs: ReadonlyArray<string>): Promise<Set<string>> {

    if (targetIDs.length === 0) {
      return new Set();
    }


    // TODO Replace with this.forbiddenIDs.intersection(new Set(targetIDs))
    const forbiddenIDs: Set<string> = new Set();

    for (const ID of targetIDs) {
      if (this.forbiddenIDs.has(ID)) {
        forbiddenIDs.add(ID);
      }
    }

    return Promise.resolve(forbiddenIDs);

  }

  public async isID_Forbidden(targetID: string): Promise<boolean> {
    return Promise.resolve(this.forbiddenIDs.has(targetID));
  }

  public async deleteForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

    removeElementsFromSet({
      targetSet: this.forbiddenIDs,
      elementsToDelete: targetIDs,
      mutably: true
    });

    return Promise.resolve();

  }


  protected async removeThenGetIssuedButHasBecomeUnnecessaryIDs(maximalQuantity: number): Promise<Array<string>> {
    return Promise.resolve(
      removeThenGetSpecificNumberOfSetElements({
        targetSet: this.issuedButWillNotBeUsedIDs,
        mustThrowErrorIfSetHasLessElementsThanSpecified: false,
        elementsCount: maximalQuantity,
        mutably: true
      }).
          removedElements
    );
  }

  protected async registerIssuedButNotUsedYetIDs(targetIDs: ReadonlyArray<string>): Promise<void> {

    addElementsToSet({
      targetSet: this.issuedButWillNotBeUsedIDs,
      mutably: false,
      newElements: targetIDs
    });

    return Promise.resolve();

  }

  protected override async synchronizeReversedPositions(): Promise<void> {
    return Promise.resolve();
  }

  protected override async synchronizeSeries(): Promise<void> {
    return Promise.resolve();
  }


  public async getForbiddenIDs(): Promise<Set<string>> {
    return Promise.resolve(this.forbiddenIDs);
  }

}
