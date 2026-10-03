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
      "Reporting of Externally Issued IDs",
      async (): Promise<void> => {

        await Promise.all(
          [
            new ExperimentalPersistentSerialNanoIDsGenerator({
                initialPositions: [
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3"
                ]
              }),
              new ExperimentalInMemorySerialNanoID_Generator({
                initialPositions: [
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3", "3", "3", "3", "3",
                  "3"
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
                      experimentalSerialNanoIDsGenerator.NAME,
                      async (): Promise<void> => {

                        /* [ Approach ] Keep reverse order to test can the ID generator sort the IDs */
                        await experimentalSerialNanoIDsGenerator.reportExternallyIssuedUsageOfIDs([
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

                        const nextID: string = await experimentalSerialNanoIDsGenerator.generateOne();

                        await Promise.all([

                          Testing.test(
                            "Next ID is matching with expected",
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
                            "No RAM has been wasted for the storing of irrelevant IDs",
                            (): void => {

                              const forbiddenIDs: ReadonlySet<string> = experimentalSerialNanoIDsGenerator.getForbiddenIDs();

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

                    )
              )

        );

      }
    ).

    catch(Logger.logPromiseError);
