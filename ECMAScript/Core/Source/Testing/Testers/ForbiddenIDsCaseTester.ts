import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import type Tester from "../Tester";
import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "node:assert";


abstract class ForbiddenIDsCaseTester {

  public static test(
    implementations:
        ReadonlyArray<Tester.Implementation<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "Forbidden IDs...",
          async (): Promise<void> => {

            await Promise.all([

              Testing.describe(
                "... has been set initially",
                async (): Promise<void> => {

                  await Promise.all(
                    implementations.map(
                      async (
                        { instanceCreator: createInstance, nameForLogging: implementationNameForLogging }:
                            Tester.Implementation<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>
                      ): Promise<void> => {

                        const serialNanoID_Generator: TestableSerialNanoIDsGenerator =
                            await createInstance({

                              initialPositions: new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("3"),

                              /* [ Approach ] Keep the reversed order to check the arranging capabilities of IDs generators. */
                              forbiddenIDs: new Set([
                                new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join(""),
                                new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join(""),
                                `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("3").join("") }4`,
                                new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("3").join(""),
                                new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("2").join(""),
                                new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("1").join("")
                              ])
                            });

                        /* [ Approach ]
                         * Here must be the "test" function, not "suite"; otherwise the execution sequence will break. */
                        await Testing.test(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            await Testing.test(
                              "No RAM has been wasted for the storing of irrelevant IDs",
                              async (): Promise<void> => {

                                const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                Assert.deepStrictEqual(forbiddenIDs.size, 4);

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("3").join("")),
                                  true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(`${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("3").join("") }4`),
                                  true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join("")),
                                  true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join("")),
                                  true
                                );

                              }
                            );


                            const nextID: string = await serialNanoID_Generator.generateOne();

                            await Promise.all([

                              Testing.test(
                                "Next ID is matching with expected one",
                                (): void => {

                                  Assert.deepStrictEqual(
                                    nextID,
                                    `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("3").join("") }5`
                                  );

                                }
                              ),

                              Testing.test(
                                "Not relevant IDs has been removed after issuing of new ID",
                                async (): Promise<void> => {

                                  const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                  Assert.deepStrictEqual(forbiddenIDs.size, 2);

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join("")),
                                    true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join("")),
                                    true
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
              ),

              Testing.describe(
                "... has been reported",
                async (): Promise<void> => {

                  await Promise.all(
                    implementations.map(
                      async (
                        { instanceCreator: createInstance, nameForLogging: implementationNameForLogging }:
                            Tester.Implementation<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>
                      ): Promise<void> => {

                        const serialNanoID_Generator: TestableSerialNanoIDsGenerator =
                            await createInstance({ initialPositions: new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("3") });

                        /* [ Approach ] Keep the reversed order to check the arranging capabilities of IDs generators. */
                        await serialNanoID_Generator.reportExternallyIssuedUsageOfIDs([
                          new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join(""),
                          new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join(""),
                          `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("3").join("") }4`,
                          new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("3").join(""),
                          new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("2").join(""),
                          new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("1").join("")
                        ]);

                        /* [ Approach ]
                         * Here must be the "test" function, not "suite"; otherwise the execution sequence will break. */
                        await Testing.test(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            await Testing.test(
                              "Only relevant forbidden IDs has been stored",
                              async (): Promise<void> => {

                                const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                /* [ Theory ]
                                 * Unlike initially set forbidden IDs, `reportExternallyIssuedUsageOfIDs()` also
                                 *   changes the positions if required. */
                                Assert.deepStrictEqual(forbiddenIDs.size, 2);

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join("")),
                                  true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join("")),
                                  true
                                );

                              }
                            );

                            const nextID: string = await serialNanoID_Generator.generateOne();

                            await Promise.all([

                              Testing.test(
                                "Next ID is matching with expected one",
                                (): void => {

                                  Assert.deepStrictEqual(
                                    nextID,
                                    `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("3").join("") }5`
                                  );

                                }
                              ),

                              Testing.test(
                                "No RAM has been wasted for the storing of irrelevant IDs",
                                async (): Promise<void> => {

                                  const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                  Assert.deepStrictEqual(forbiddenIDs.size, 2);

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("4").join("")),
                                        true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("5").join("")),
                                        true
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


namespace ForbiddenIDsCaseTester {

  export namespace InstanceCreator {

    export type Options = Readonly<{
      initialPositions: ReadonlyArray<string>;
      forbiddenIDs?: ReadonlySet<string>;
    }>;

  }

}


export default ForbiddenIDsCaseTester;
