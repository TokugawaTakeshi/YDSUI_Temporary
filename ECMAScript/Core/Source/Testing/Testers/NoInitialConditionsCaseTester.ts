import type { TestableSerialNanoIDsGenerator } from "../TestableSerialNanoIDsGenerator";
import type Tester from "../Tester";
import { FIXED_CHARACTERS_COUNT_IN_NANO_ID } from "fundamental-constants";
import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "node:assert";


abstract class NoInitialConditionsCaseTester {

  public static test(
    implementations:
        ReadonlyArray<
          Tester.Implementation<TestableSerialNanoIDsGenerator, NoInitialConditionsCaseTester.InstanceCreator.Options>
        >
  ): void {

    Testing.

        describe(
          "No Initial Conditions",
          async (): Promise<void> => {

            await Promise.all(
              implementations.map(
                async (
                  { instanceCreator: createInstance, nameForLogging: implementationNameForLogging }:
                      Tester.Implementation<
                        TestableSerialNanoIDsGenerator, NoInitialConditionsCaseTester.InstanceCreator.Options
                      >
                ): Promise<void> => {

                  await Testing.describe(
                    implementationNameForLogging,
                    async (): Promise<void> => {

                      const serialNanoID_Generator: TestableSerialNanoIDsGenerator = await createInstance({});

                      const firstID: string = await serialNanoID_Generator.generateOne();
                      const secondID: string = await serialNanoID_Generator.generateOne();

                      await Promise.all([

                        Testing.test(
                          "1st ID is correct",
                          (): void => {
                            Assert.deepStrictEqual(
                              firstID,
                              new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID).fill("A").join("")
                            );
                          }
                        ),

                        Testing.test(
                          "2st ID is correct",
                          (): void => {
                            Assert.deepStrictEqual(
                              secondID,
                              `${ new Array(FIXED_CHARACTERS_COUNT_IN_NANO_ID - 1).fill("A").join("") }B`
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

    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-generated-empty-object-type --
     * Want and empty object in this case because no options are needed. */
    export type Options = Readonly<{}>;

  }

}


export default NoInitialConditionsCaseTester;
