import Testing from "node:test";
import Assert from "assert";
import type { SerialNanoID_Generator } from "../SerialNanoID_Generator";
import {  } from "@yamato-daiwa/es-extensions";



export class ExternallyIssuesID_Tester {

  public static test(): void {

  }

}

export namespace ExternallyIssuesID_Tester {

  // TODO RequiredBy
  export type Options = SerialNanoID_Generator.Options;

}


export function externallyIssuesID_Tester(
  instancesCreators: ReadonlyArray<(commonOptions: Readonly<{ initialPositions: Array<string>; }>) => SerialNanoID_Generator>
): void {

  await Testing.

    suite(
      "Reporting of Externally Issued IDs",
      async (): Promise<void> => {

        await Promise.all(

          instancesCreators.

              map(
                async (
                  crateInstance: (commonOptions: Readonly<{ initialPositions: Array<string>; }>) => SerialNanoID_Generator
                ): Promise<void> => {

                  const instance = crateInstance({
                    initialPositions: ""
                  });

                }

        );

      }
    );

}


/*

Testing.suite(
  "PersistentSerialNanoIDsGenerator",
  async (): Promise<void> => {

    await Promise.all([

      Testing.test(
        "Usage of previously issued but abandoned IDs",
        async (): Promise<void> => {

          const experimentalSerialNanoIDsGenerator: ExperimentalPersistentSerialNanoIDsGenerator =
              new ExperimentalPersistentSerialNanoIDsGenerator({
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

          const firstID: string = await experimentalSerialNanoIDsGenerator.generateOne();
          const secondID: string = await experimentalSerialNanoIDsGenerator.generateOne();
          const thirdID: string = await experimentalSerialNanoIDsGenerator.generateOne();

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
              "3rd ID has not been issued from unused ones as expected",
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
      )

    ]);

  }
).catch(Logger.logPromiseError);


*/
