/* eslint-disable @stylistic/array-element-newline -- Allow to improve the readability of positions' array */

import ExperimentalPersistentSerialNanoIDsGenerator from
    "./ExperimentalImplementations/ExperimentalPersistentSerialNanoIDsGenerator";
import ExperimentalInMemorySerialNanoID_Generator from
    "./ExperimentalImplementations/ExperimentalInMemorySerialNanoID_Generator";

import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "assert";


Testing.

    suite(
      "No Initial Conditions",
      async (): Promise<void> => {

        await Promise.all(

          [
            new ExperimentalPersistentSerialNanoIDsGenerator(),
            new ExperimentalInMemorySerialNanoID_Generator()
          ].

              map(
                async (
                  experimentalSerialNanoIDsGenerator:
                      ExperimentalPersistentSerialNanoIDsGenerator |
                      ExperimentalInMemorySerialNanoID_Generator
                ): Promise<void> =>

                    Testing.suite(
                      "First 2 IDs has been generated correctly",
                      async (): Promise<void> => {

                        const firstID: string = await experimentalSerialNanoIDsGenerator.generateOne();
                        const secondID: string = await experimentalSerialNanoIDsGenerator.generateOne();

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
                    )

              )

        );

      }
    ).

    catch(Logger.logPromiseError);
