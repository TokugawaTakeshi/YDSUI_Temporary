import type PersistentSerialNanoIDsGenerator from "./PersistentSerialNanoIDsGenerator";
import { type ArbitraryObject, Logger } from "@yamato-daiwa/es-extensions";


export async function addEntityToDataSourceRespectingPossibleIDsConflictsEvenWithPersistentSerialNanoIDsGenerator<
  BeforeEntityCreatingHookData extends object = ArbitraryObject
>(
  {
    persistentSerialNanoIDsGenerator,
    onBeforeEntityCreating,
    entityCreatingOperation,
    rollingBackOfBeforeEntityCreatingActions,
    isIDsConflictError,
    maximalNumberOfIDsConflicts,
    maximalNumbersOfIDsConflictsReachedErrorThrower,
    throwerOfErrorsOtherThanIDs_Conflict
  }: Readonly<{
    persistentSerialNanoIDsGenerator: PersistentSerialNanoIDsGenerator;
    onBeforeEntityCreating?: (ID_ForNewEntity: string) => Promise<BeforeEntityCreatingHookData>;
    entityCreatingOperation:
        (ID_ForNewEntity: string, beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => Promise<unknown>;
    rollingBackOfBeforeEntityCreatingActions?: (beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => Promise<void>;
    isIDsConflictError: (error: unknown) => boolean;
    maximalNumberOfIDsConflicts: number;
    maximalNumbersOfIDsConflictsReachedErrorThrower?: () => never;
    throwerOfErrorsOtherThanIDs_Conflict?: (error: unknown, beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => never;
  }>
): Promise<string> {

  let ID_ForNewEntity: string;
  let IDsConflictsCount: number = 0;

  do {

    /* eslint-disable no-await-in-loop --
     * The parallel is impossible from the viewpoint of the algorithm. Commonly, it will be only one iteration. */
    ID_ForNewEntity = await persistentSerialNanoIDsGenerator.generateOne();

    let beforeEntityCreatingHookData: BeforeEntityCreatingHookData | undefined;

    try {

      beforeEntityCreatingHookData =

          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
          * If `onBeforeEntityCreating` not specified then `BeforeEntityCreatingHookData` will be an empty object. */
          await (onBeforeEntityCreating?.(ID_ForNewEntity) ?? Promise.resolve({} as BeforeEntityCreatingHookData));

      await entityCreatingOperation(ID_ForNewEntity, beforeEntityCreatingHookData);

      await persistentSerialNanoIDsGenerator.reportSuccessfulUsageOfIssuedIDs([ ID_ForNewEntity ]);

      return ID_ForNewEntity;

    } catch (error: unknown) {

      if (isIDsConflictError(error)) {

        await persistentSerialNanoIDsGenerator.reportExternallyIssuedUsageOfIDs([ ID_ForNewEntity ]);

        IDsConflictsCount++;

      } else {

        await persistentSerialNanoIDsGenerator.reportHasBecomeUnnecessaryIDs([ ID_ForNewEntity ]);

        await (

          /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
           * If `onBeforeEntityCreating` not specified then `BeforeEntityCreatingHookData` will be an empty object. */
          rollingBackOfBeforeEntityCreatingActions?.(beforeEntityCreatingHookData ?? {} as BeforeEntityCreatingHookData) ??
          Promise.resolve()

        );
        /* eslint-enable no-await-in-loop */

        (throwerOfErrorsOtherThanIDs_Conflict ?? ((): never => { throw error; }))(

            error,

            /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions --
             * If `onBeforeEntityCreating` not specified then `BeforeEntityCreatingHookData` will be an empty object. */
            beforeEntityCreatingHookData ?? {} as BeforeEntityCreatingHookData

        );

      }

    }

  } while (IDsConflictsCount <= maximalNumberOfIDsConflicts);

  maximalNumbersOfIDsConflictsReachedErrorThrower?.();

  Logger.throwErrorWithFormattedMessage({
    errorType: "IDsConflictsMaximalCountReached",
    description: "IDs Conflicts Maximal Count Reached",
    title: "IDs Conflicts Maximal Count Reached",
    occurrenceLocation:
        "addEntityRespectingPossibleIDsConflictsEvenWithPersistentSerialNanoIDsGenerator(compoundParameter)"
  });

}
