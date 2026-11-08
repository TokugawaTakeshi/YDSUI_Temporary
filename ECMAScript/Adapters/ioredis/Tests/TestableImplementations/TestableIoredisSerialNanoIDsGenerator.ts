import { TestableSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";
import IoredisSerialNanoIDsGenerator from "../../Source";


export default class TestableIoredisSerialNanoIDsGenerator
    extends IoredisSerialNanoIDsGenerator
    implements TestableSerialNanoIDsGenerator
{

  private static readonly KEY_PREFIX: string = "TESTABLE_IOREDIS_SERIAL_NANO_IDS_GENERATOR";

  public static async initialize(
    options: Omit<IoredisSerialNanoIDsGenerator.InitializationOptions, "redisKeys">
  ): Promise<TestableIoredisSerialNanoIDsGenerator> {

    return IoredisSerialNanoIDsGenerator.executeCommonInitialization({

      ...options,

      redisKeys: {

        reversedPositions: `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-REVERSED_POSITIONS`,

        series: `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-SERIES`,

        issuedButHasNotBeenUsedYetIDs:
            `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-ISSUED_BUT_HAS_NOT_BEEN_USED_YET_IDS`,

        issuedButHasBecomeUnnecessaryIDs:
            `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-ISSUED_BUT_HAS_BECOME_UNNECESSARY_IDS`,

        forbiddenIDs: `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-FORBIDDEN_IDS`,

        mustInclude0thSeriesToIDsFlag:
            `${ TestableIoredisSerialNanoIDsGenerator.KEY_PREFIX }-MUST_INCLUDE_0TH_SERIES_TO_IDS_FLAG`

      },

      inheritorInstanceCreator:
          (constructorParameter: IoredisSerialNanoIDsGenerator.ConstructorParameter):
              TestableIoredisSerialNanoIDsGenerator =>
                  new TestableIoredisSerialNanoIDsGenerator(constructorParameter)

    });

  }

  public getForbiddenIDs(): Promise<Set<string>> {
    return Promise.resolve(undefined);
  }

  public getIssuedButUsageNotConfirmedIDs(): Promise<Set<string>> {
    return Promise.resolve(undefined);
  }

  public getIssuedButWillNotBeUsedIDs(): Promise<Set<string>> {
    return Promise.resolve(undefined);
  }

}
