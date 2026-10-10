import Testing from "node:test";
import Assert from "assert";
import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import { Logger } from "@yamato-daiwa/es-extensions";
import type Tester from "../Tester";


class AbandonedIDsCaseTester {

  public static test(
    instancesCreators:
        ReadonlyArray<Tester.InstanceCreator<TestableSerialNanoIDsGenerator, AbandonedIDsCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "Abandoned IDs",
          async (): Promise<void> => {

            await Promise.all(
              instancesCreators.map(
                async (
                  createInstance:
                      Tester.InstanceCreator<TestableSerialNanoIDsGenerator, AbandonedIDsCaseTester.InstanceCreator.Options>
                ): Promise<void> => {

                  await Promise.all([

                    Testing.describe(
                      "Reusage of initially set abandoned IDs",
                      async (): Promise<void> => {

                        const {
                          instance: IDsGenerator,
                          nameForLogging: implementationNameForLogging
                        }: AbandonedIDsCaseTester.InstanceCreator.Data = createInstance({
                          initialPositions: [
                            "A", "A", "A", "A", "A",
                            "A", "A", "A", "A", "A",
                            "A", "A", "A", "A", "A",
                            "A", "A", "A", "A", "A",
                            "D"
                          ],
                          issuedButWillNotBeUsedIDs:
                            new Set<string>([

                              [
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "B"
                              ].join(""),

                              [
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "C"
                              ].join("")

                            ])
                        });

                        const firstID: string = await IDsGenerator.generateOne();
                        const secondID: string = await IDsGenerator.generateOne();
                        const thirdID: string = await IDsGenerator.generateOne();

                        await Testing.describe(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            await Promise.all([

                              Testing.test(
                                "1st ID has been issued from unused ones as expected",
                                (): void => {

                                  Assert.deepStrictEqual(

                                    firstID,

                                    [
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "B"
                                    ].
                                        join("")

                                  );

                                }
                              ),

                              Testing.test(
                                "2nd ID has been issued from unused ones as expected",
                                (): void => {

                                  Assert.deepStrictEqual(

                                    secondID,

                                    [
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "C"
                                    ].
                                        join("")

                                  );

                                }
                              ),

                              Testing.test(
                                "3rd ID has not been issued from current positions as expected",
                                (): void => {

                                  Assert.deepStrictEqual(

                                    thirdID,

                                    [
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "A", "A", "A", "A", "A",
                                      "D"
                                    ].
                                        join("")

                                  );

                                }
                              )

                            ]);

                          }
                        );

                      }
                    ),

                    Testing.describe(
                      "Reusage of reported abandoned IDs"
                    ),

                    Testing.describe(
                      "Abandoned ID has become forbidden"
                    )

                  ]);

                }
              )
            );

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
      forbiddenIDs?: ReadonlySet<string>
    }>;

    export type Data = Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator>;

  }

}


export default AbandonedIDsCaseTester;
