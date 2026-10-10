import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import { Logger } from "@yamato-daiwa/es-extensions";
import type Tester from "../Tester";
import Testing from "node:test";
import Assert from "assert";


abstract class NoInitialConditionsCaseTester {

  public static test(
    instancesCreators:
        ReadonlyArray<
          Tester.InstanceCreator<TestableSerialNanoIDsGenerator, NoInitialConditionsCaseTester.InstanceCreator.Options>
        >
  ): void {

    Testing.

        describe(
          "No Initial Conditions",
          async (): Promise<void> => {

            await Promise.all(
              instancesCreators.map(
                async (
                  createInstance:
                      Tester.InstanceCreator<
                        TestableSerialNanoIDsGenerator, NoInitialConditionsCaseTester.InstanceCreator.Options
                      >
                ): Promise<void> => {

                  const {
                    instance: serialNanoID_Generator,
                    nameForLogging: implementationNameForLogging
                  }:
                      Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator> =
                          createInstance({});

                  await Testing.describe(
                    implementationNameForLogging,
                    async (): Promise<void> => {

                      const firstID: string = await serialNanoID_Generator.generateOne();
                      const secondID: string = await serialNanoID_Generator.generateOne();

                      await Promise.all([

                        Testing.test(
                          "1st ID is correct",
                          (): void => {

                            Assert.deepStrictEqual(

                              firstID,

                              [
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A", "A", "A", "A", "A",
                                "A"
                              ].
                                  join("")

                            );

                          }
                        ),

                        Testing.test(
                          "2st ID is correct",
                          (): void => {

                            Assert.deepStrictEqual(

                              secondID,

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
                        )

                      ]);

                    }
                  );

                }
              )
            );

          }
        ).

        catch(Logger.logPromiseError);

  }

}


namespace NoInitialConditionsCaseTester {

  export namespace InstanceCreator {

    export type Options = Readonly<{}>;

    export type Data = Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator>;

  }

}


export default NoInitialConditionsCaseTester;
