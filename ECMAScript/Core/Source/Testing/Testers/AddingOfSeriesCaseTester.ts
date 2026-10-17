import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import type Tester from "../Tester";
import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "node:assert";


abstract class AddingOfSeriesCaseTester {

  public static test(
    implementations:
        ReadonlyArray<Tester.Implementation<TestableSerialNanoIDsGenerator, AddingOfSeriesCaseTester.InstanceCreator.Options>>
  ): void {

    Testing.

        describe(
          "No Initial Conditions",
          async (): Promise<void> => {

            await Promise.all(
              implementations.map(
                async (
                  { instanceCreator: createInstance, nameForLogging: implementationNameForLogging }:
                      Tester.Implementation<TestableSerialNanoIDsGenerator, AddingOfSeriesCaseTester.InstanceCreator.Options>
                ): Promise<void> => {

                  const serialNanoID_Generator: TestableSerialNanoIDsGenerator =
                        await createInstance({ initialPositions: new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("-") });

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
                              new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("-").join("")
                            );

                          }
                        ),

                        Testing.test(
                          "2st ID of 1st series is correct",
                          (): void => {

                            Assert.deepStrictEqual(
                              firstID_Of1stSeries,
                              `1~${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("A").join("") }`
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

  }

}


export default AddingOfSeriesCaseTester;
