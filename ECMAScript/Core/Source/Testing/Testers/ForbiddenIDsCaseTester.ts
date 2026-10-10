import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import { Logger } from "@yamato-daiwa/es-extensions";
import type Tester from "../Tester";
import Testing from "node:test";
import Assert from "assert";


abstract class ForbiddenIDsCaseTester {

  public static test(
    instancesCreators:
        ReadonlyArray<Tester.InstanceCreator<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "Forbidden IDs ...",
          async (): Promise<void> => {

            await Promise.all([

              Testing.describe(
                "... has been set initially",
                async (): Promise<void> => {

                  await Promise.all(
                    instancesCreators.map(
                      async (
                        createInstance:
                            Tester.InstanceCreator<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>
                      ): Promise<void> => {

                        const {
                          instance: serialNanoID_Generator,
                          nameForLogging: implementationNameForLogging
                        }:
                            Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator> =
                                createInstance({
                                  initialPositions: [
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3"
                                  ],
                                  forbiddenIDs: new Set([
                                    [
                                      "5", "5", "5", "5", "5",
                                      "5", "5", "5", "5", "5",
                                      "5", "5", "5", "5", "5",
                                      "5", "5", "5", "5", "5",
                                      "5"
                                    ].join(""),
                                    [
                                      "4", "4", "4", "4", "4",
                                      "4", "4", "4", "4", "4",
                                      "4", "4", "4", "4", "4",
                                      "4", "4", "4", "4", "4",
                                      "4"
                                    ].join(""),
                                    [
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "4"
                                    ].join(""),
                                    [
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3"
                                    ].join(""),
                                    [
                                      "2", "2", "2", "2", "2",
                                      "2", "2", "2", "2", "2",
                                      "2", "2", "2", "2", "2",
                                      "2", "2", "2", "2", "2",
                                      "2"
                                    ].join(""),
                                    [
                                      "1", "1", "1", "1", "1",
                                      "1", "1", "1", "1", "1",
                                      "1", "1", "1", "1", "1",
                                      "1", "1", "1", "1", "1",
                                      "1"
                                    ].join("")
                                  ])
                                });

                        await Testing.describe(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            console.log("CHECKPOINT 1");

                            await Testing.test(
                              "No RAM has been wasted for the storing of irrelevant IDs",
                              async (): Promise<void> => {

                                const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                console.log("CHECKPOINT 2");
                                console.log(await serialNanoID_Generator.getForbiddenIDs());

                                Assert.deepStrictEqual(forbiddenIDs.size, 4);

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "4"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5"
                                        ].join("")
                                      ),
                                      true
                                );

                                console.log("CHECKPOINT 3");

                              }
                            );


                            console.log("CHECKPOINT 4");
                            const nextID: string = await serialNanoID_Generator.generateOne();

                            await Promise.all([

                              Testing.test(
                                "Next ID is matching with expected one",
                                (): void => {


                                  Assert.deepStrictEqual(

                                    nextID,

                                    [
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "5"
                                    ].
                                        join("")

                                  );

                                }
                              ),

                              Testing.test(
                                "Not relevant IDs has been removed after issuing of new ID",
                                async (): Promise<void> => {

                                  const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                  Assert.deepStrictEqual(forbiddenIDs.size, 4);

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(
                                          [
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "3"
                                          ].join("")
                                        ),
                                        true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(
                                          [
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "3", "3", "3", "3", "3",
                                            "4"
                                          ].join("")
                                        ),
                                        true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(
                                          [
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4"
                                          ].join("")
                                        ),
                                        true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(
                                          [
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5"
                                          ].join("")
                                        ),
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
                    instancesCreators.map(
                      async (
                        createInstance:
                            Tester.InstanceCreator<TestableSerialNanoIDsGenerator, ForbiddenIDsCaseTester.InstanceCreator.Options>
                      ): Promise<void> => {

                        const {
                          instance: serialNanoID_Generator,
                          nameForLogging: implementationNameForLogging
                        }:
                            Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator> =
                                createInstance({
                                  initialPositions: [
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3", "3", "3", "3", "3",
                                    "3"
                                  ]
                                });

                        /* [ Approach ] Keep reverse order to test can the ID generator sort the IDs */
                        await serialNanoID_Generator.reportExternallyIssuedUsageOfIDs([
                          [
                            "5", "5", "5", "5", "5",
                            "5", "5", "5", "5", "5",
                            "5", "5", "5", "5", "5",
                            "5", "5", "5", "5", "5",
                            "5"
                          ].join(""),
                          [
                            "4", "4", "4", "4", "4",
                            "4", "4", "4", "4", "4",
                            "4", "4", "4", "4", "4",
                            "4", "4", "4", "4", "4",
                            "4"
                          ].join(""),
                          [
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "4"
                          ].join(""),
                          [
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "3", "3", "3", "3", "3",
                            "3"
                          ].join(""),
                          [
                            "2", "2", "2", "2", "2",
                            "2", "2", "2", "2", "2",
                            "2", "2", "2", "2", "2",
                            "2", "2", "2", "2", "2",
                            "2"
                          ].join(""),
                          [
                            "1", "1", "1", "1", "1",
                            "1", "1", "1", "1", "1",
                            "1", "1", "1", "1", "1",
                            "1", "1", "1", "1", "1",
                            "1"
                          ].join("")
                        ]);

                        await Testing.describe(
                          implementationNameForLogging,
                          async (): Promise<void> => {

                            await Testing.test(
                              "Not relevant IDs has been removed after issuing of new ID",
                              async (): Promise<void> => {

                                const forbiddenIDs: ReadonlySet<string> = await serialNanoID_Generator.getForbiddenIDs();

                                console.log("CHECKPOINT 2");
                                console.log(await serialNanoID_Generator.getForbiddenIDs());

                                Assert.deepStrictEqual(forbiddenIDs.size, 4);

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "3", "3", "3", "3", "3",
                                          "4"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4", "4", "4", "4", "4",
                                          "4"
                                        ].join("")
                                      ),
                                      true
                                );

                                Assert.deepStrictEqual(
                                  forbiddenIDs.
                                      has(
                                        [
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5", "5", "5", "5", "5",
                                          "5"
                                        ].join("")
                                      ),
                                      true
                                );

                                console.log("CHECKPOINT 3");

                              }
                            );


                            const nextID: string = await serialNanoID_Generator.generateOne();

                            await Promise.all([

                              Testing.test(
                                "Next ID is matching with expected one",
                                async (): Promise<void> => {



                                  Assert.deepStrictEqual(

                                    nextID,

                                    [
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "3", "3", "3", "3", "3",
                                      "5"
                                    ].
                                        join("")

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
                                        has(
                                          [
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4", "4", "4", "4", "4",
                                            "4"
                                          ].join("")
                                        ),
                                        true
                                  );

                                  Assert.deepStrictEqual(
                                    forbiddenIDs.
                                        has(
                                          [
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5", "5", "5", "5", "5",
                                            "5"
                                          ].join("")
                                        ),
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

            ])

          }
        ).

        catch(Logger.logPromiseError);

  }

}


namespace ForbiddenIDsCaseTester {

  export namespace InstanceCreator {

    export type Options = Readonly<{
      initialPositions: ReadonlyArray<string>;
      forbiddenIDs?: ReadonlySet<string>
    }>;

    export type Data = Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator>;

  }

}


export default ForbiddenIDsCaseTester;
