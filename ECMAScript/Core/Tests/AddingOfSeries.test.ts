/* eslint-disable @stylistic/array-element-newline -- Allow to improve the readability of positions' array */

import ExperimentalInMemorySerialNanoID_Generator from
    "./ExperimentalImplementations/ExperimentalInMemorySerialNanoID_Generator";
import ExperimentalPersistentSerialNanoIDsGenerator from
    "./ExperimentalImplementations/ExperimentalPersistentSerialNanoIDsGenerator";

import { Logger } from "@yamato-daiwa/es-extensions";
import Testing from "node:test";
import Assert from "assert";


Testing.

    suite(
      "Adding of Series",
      async (): Promise<void> => {

        await Promise.all(
          [
            new ExperimentalPersistentSerialNanoIDsGenerator({
              initialPositions: [
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-"
              ]
            }),
            new ExperimentalInMemorySerialNanoID_Generator({
              initialPositions: [
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-", "-", "-", "-", "-",
                "-"
              ]
            })
          ].

              map(
                async (
                  experimentalSerialNanoIDsGenerator:
                      ExperimentalPersistentSerialNanoIDsGenerator |
                      ExperimentalInMemorySerialNanoID_Generator
                ): Promise<void> =>

                    Testing.suite(
                      "Adding of first series is correct",
                      async (): Promise<void> => {

                        const lastID_Of0thSeries: string = await experimentalSerialNanoIDsGenerator.generateOne();
                        const firstID_Of1stSeries: string = await experimentalSerialNanoIDsGenerator.generateOne();

                        await Promise.all([

                          Testing.test(
                            "1st ID is correct",
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
                            "2st ID is correct",
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
                    )


              )

        );

      }
    ).

    catch(Logger.logPromiseError);
