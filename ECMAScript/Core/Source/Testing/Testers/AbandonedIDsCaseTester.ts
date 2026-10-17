import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import type Tester from "../Tester";
import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "node:assert";


class AbandonedIDsCaseTester {

  public static test(
    instancesCreators:
        ReadonlyArray<Tester.Implementation<TestableSerialNanoIDsGenerator, AbandonedIDsCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "Abandoned IDs...",
          async (): Promise<void> => {

            await Promise.all([

              Testing.describe(
                "... has been set initially",
                async (): Promise<void> => {

                  await Promise.all(
                    instancesCreators.map(
                      async (
                        { instanceCreator: createInstance, nameForLogging: implementationNameForLogging }:
                            Tester.Implementation<TestableSerialNanoIDsGenerator, AbandonedIDsCaseTester.InstanceCreator.Options>
                      ): Promise<void> => {

                        const serialNanoID_Generator: TestableSerialNanoIDsGenerator =
                            await createInstance({
                              initialPositions: [ ...new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A"), "D" ],
                              issuedButWillNotBeUsedIDs: new Set([
                                `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }B`,
                                `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }C`
                              ])
                            });

                        await Testing.test(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            const firstID__expectedToBePreviouslyIssued: string = await serialNanoID_Generator.generateOne();
                            const secondID__expectedToBePreviouslyIssued: string = await serialNanoID_Generator.generateOne();
                            const thirdID__expectedToBeNew: string = await serialNanoID_Generator.generateOne();

                            await Promise.all([

                              Testing.test(
                                "1st ID has been issued from unused ones as expected",
                                (): void => {
                                  Assert.deepStrictEqual(
                                    firstID__expectedToBePreviouslyIssued,
                                    `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }B`
                                  );
                                }
                              ),

                              Testing.test(
                                "2nd ID has been issued from unused ones as expected",
                                (): void => {
                                  Assert.deepStrictEqual(
                                    secondID__expectedToBePreviouslyIssued,
                                    `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }C`
                                  );
                                }
                              ),

                              Testing.test(
                                "3rd ID has not been issued from current positions as expected",
                                (): void => {
                                  Assert.deepStrictEqual(
                                    thirdID__expectedToBeNew,
                                    `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }D`
                                  );
                                }
                              )

                            ]);

                          }
                        );

                      }
                    )
                  );

                }
              )

            ]);

          }
        ).

        catch(Logger.logPromiseError);

  }

}

namespace AbandonedIDsCaseTester {

  export namespace InstanceCreator {

    export type Options = Readonly<{
      initialPositions: ReadonlyArray<string>;
      issuedButWillNotBeUsedIDs?: ReadonlySet<string>;
      forbiddenIDs?: ReadonlySet<string>;
    }>;

  }

}


export default AbandonedIDsCaseTester;
