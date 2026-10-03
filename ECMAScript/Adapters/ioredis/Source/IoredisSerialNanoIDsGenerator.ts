import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;


  protected constructor(
    {
      ioredisInstance,
      redisKeys,
      ...options
    }:
        IoredisSerialNanoIDsGenerator.ConstructorParameter
  ) {

    super(options);

    this.ioredisInstance = ioredisInstance;
    this.redisKeys = redisKeys;
    
  }


  /* ━━━ Implementation of the Abstract Methods ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Public ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */

  public async reportSuccessfulUsageOfIssuedIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.srem(this.redisKeys.issuedButHasNotBeenUsedYetIDs, ...targetIDs);
  }

  public async reportHasBecomeUnnecessaryIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.issuedButHasBecomeUnnecessaryIDs, ...targetIDs);
  }


  /* ╍╍╍ Forbidden IDs ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  public async registerForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.forbiddenIDs, ...targetIDs);
  }

  public async isID_Forbidden(targetID: string): Promise<boolean> {
    return await this.ioredisInstance.sismember(this.redisKeys.forbiddenIDs, targetID) === 1;
  }

  public async deleteForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.srem(this.redisKeys.forbiddenIDs, ...targetIDs);
  }


  /* ┅┅┅ Protected ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  protected async removeThenGetIssuedButHasBecomeUnnecessaryIDs(maximalQuantity: number): Promise<Array<string>> {
    return this.ioredisInstance.spop(this.redisKeys.issuedButHasBecomeUnnecessaryIDs, maximalQuantity);
  }

  protected async registerIssuedButNotUsedYetIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.issuedButHasNotBeenUsedYetIDs, ...targetIDs);
  }

  /* ╍╍╍ Synchronization ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */

  protected async synchronizeReversedPositions(): Promise<void> {
    await this.ioredisInstance.set(this.redisKeys.reversedPositions, JSON.stringify(this.reversedPositions));
  }

  protected async synchronizeSeries(): Promise<void> {
    await this.ioredisInstance.set(this.redisKeys.series, this.series);
  }

  protected async synchronizeMustInclude0thSeriesToIDsFlag(): Promise<void> {
    await this.ioredisInstance.set(this.redisKeys.mustInclude0thSeriesToIDsFlag, this.mustInclude0thSeriesToIDs ? 1 : 0);
  }


  protected static async executeCommonInitialization<Inheritor extends IoredisSerialNanoIDsGenerator>(
    {
      inheritorInstanceCreator,
      mustResetPreviousRecords = false,
      ioredisInstance,
      redisKeys
    }:
        IoredisSerialNanoIDsGenerator.InitializationOptions &
        Readonly<{
          inheritorInstanceCreator:
            (constructorParameter: IoredisSerialNanoIDsGenerator.ConstructorParameter) => Inheritor;
        }>
  ): Promise<Inheritor> {

    if (mustResetPreviousRecords) {

      await ioredisInstance.del(
        redisKeys.reversedPositions,
        redisKeys.series,
        redisKeys.issuedButHasNotBeenUsedYetIDs,
        redisKeys.issuedButHasBecomeUnnecessaryIDs,
        redisKeys.forbiddenIDs,
        redisKeys.mustInclude0thSeriesToIDsFlag
      );

      return inheritorInstanceCreator({
        ioredisInstance,
        redisKeys
      });

    }


    const [
      initialPositions,
      initialSeries,
      mustInclude0thSeriesToIDs
    ]:

      Readonly<[
        Array<string> | undefined,
        number | undefined,
        boolean | undefined
      ]> =
          await Promise.all([

            ioredisInstance.
                get(redisKeys.reversedPositions).
                then(
                  /* eslint-disable-next-line no-void -- "no-undefined" vs "no-null" conflict */
                  (value: string | null): Array<string> | undefined => (value === null ? void 0 : JSON.parse(value))
                ),

            ioredisInstance.
                get(redisKeys.series).
                then(
                  /* eslint-disable-next-line no-void -- "no-undefined" vs "no-null" conflict */
                  (value: string | null): number | undefined => (value === null ? void 0 : Number(value))
                ),

            ioredisInstance.
                get(redisKeys.mustInclude0thSeriesToIDsFlag).
                then(
                  /* eslint-disable-next-line no-void -- "no-undefined" vs "no-null" conflict */
                  (value: string | null): boolean | undefined => (value === null ? void 0 : value === "1")
                )

          ]);

    return inheritorInstanceCreator({
      ioredisInstance,
      redisKeys,
      initialPositions,
      initialSeries,
      mustInclude0thSeriesToIDs
    });

  }

}


export namespace IoredisSerialNanoIDsGenerator {

  export type ConstructorParameter =

      PersistentSerialNanoIDsGenerator.Options &

      Readonly<{
        ioredisInstance: Redis;
        redisKeys: RedisKeys;
      }>;

  export type RedisKeys = Readonly<{
    reversedPositions: string;
    series: string;
    issuedButHasNotBeenUsedYetIDs: string;
    issuedButHasBecomeUnnecessaryIDs: string;
    forbiddenIDs: string;
    mustInclude0thSeriesToIDsFlag: string;
  }>;

  export type InitializationOptions =

      ConstructorParameter &
      Readonly<{
        mustResetPreviousRecords?: boolean;
      }>;

}


export default IoredisSerialNanoIDsGenerator;
