import PersistentSerialNanoIDsGenerator from "../../Source/PersistentSerialNanoIDsGenerator";
import { addElementsToSet } from "@yamato-daiwa/es-extensions";
import removeElementsFromSet from "../../Source/Incubators/removeElementsFromSet";
import removeThenGetSpecificNumberOfSetElements from "../../Source/Incubators/removeThenGetSpecificNumberOfSetElements";


export default class ExperimentalPersistentSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  public readonly NAME: string = "ExperimentalPersistentSerialNanoIDsGenerator";

  /* [ Theory ] Has been made public only for testing purposes. */
  public readonly forbiddenIDs: Set<string> = new Set<string>();

  protected readonly issuedButUsageNotConfirmedIDs: Set<string> = new Set<string>();
  protected readonly issuedButWillNotBeUsedIDs: Set<string>;


  public constructor(
    {
      issuedButWillNotBeUsedIDs = new Set(),
      ...parentClassOptions
    }:
        PersistentSerialNanoIDsGenerator.Options &
        Readonly<{
          issuedButWillNotBeUsedIDs?: Set<string>;
        }> =
            {}
  ) {
    super(parentClassOptions);
    this.issuedButWillNotBeUsedIDs = issuedButWillNotBeUsedIDs;
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


  public getForbiddenIDs(): Set<string> {
    return this.forbiddenIDs;
  }

}
