import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import { Logger } from "@yamato-daiwa/es-extensions";
import type Tester from "../Tester";
import Testing from "node:test";
import Assert from "assert";


abstract class AddingOfSeriesCaseTester {

  public static test(
    instancesCreators:
        ReadonlyArray<Tester.InstanceCreator<TestableSerialNanoIDsGenerator, AddingOfSeriesCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "No Initial Conditions",
          async (): Promise<void> => {

            await Promise.all(
              instancesCreators.map(
                async (
                  createInstance:
                      Tester.InstanceCreator<TestableSerialNanoIDsGenerator, AddingOfSeriesCaseTester.InstanceCreator.Options>
                ): Promise<void> => {

                  const {
                    instance: serialNanoID_Generator,
                    nameForLogging: implementationNameForLogging
                  }:
                      Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator> =
                          createInstance({
                            initialPositions: [
                              "-", "-", "-", "-", "-",
                              "-", "-", "-", "-", "-",
                              "-", "-", "-", "-", "-",
                              "-", "-", "-", "-", "-",
                              "-"
                            ]
                          });

                  await Testing.describe(
                    implementationNameForLogging,
                    async (): Promise<void> => {

                      const lastID_Of0thSeries: string = await serialNanoID_Generator.generateOne();
                      const firstID_Of1stSeries: string = await serialNanoID_Generator.generateOne();

                      await Promise.all([

                        Testing.test(
                          "Last ID of 0th series is correct",
                          (): void => {

                            Assert.deepStrictEqual(

                              lastID_Of0thSeries,

                              [
                                "-", "-", "-", "-", "-",
                                "-", "-", "-", "-", "-",
                                "-", "-", "-", "-", "-",
                                "-", "-", "-", "-", "-",
                                "-"
                              ].
                                  join("")

                            );

                          }
                        ),

                        Testing.test(
                          "2st ID of 1st series is correct",
                          (): void => {

                            Assert.deepStrictEqual(

                              firstID_Of1stSeries,

                              "1~" +
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


namespace AddingOfSeriesCaseTester {

  export namespace InstanceCreator {

    export type Options = Readonly<{ initialPositions?: ReadonlyArray<string>; }>;

    export type Data = Tester.InstanceCreator.Data<TestableSerialNanoIDsGenerator>;

  }

}


export default AddingOfSeriesCaseTester;
