import { externallyIssuesID_Tester } from "../Source";
import ExperimentalPersistentSerialNanoIDsGenerator from
      "./ExperimentalImplementations/ExperimentalPersistentSerialNanoIDsGenerator";
import ExperimentalInMemorySerialNanoID_Generator from
      "./ExperimentalImplementations/ExperimentalInMemorySerialNanoID_Generator";


externallyIssuesID_Tester([
  ({ initialPositions }: Readonly<{ initialPositions: Array<string>; }>): ExperimentalPersistentSerialNanoIDsGenerator =>
      new ExperimentalPersistentSerialNanoIDsGenerator({ initialPositions }),
  ({ initialPositions }: Readonly<{ initialPositions: Array<string>; }>): ExperimentalInMemorySerialNanoID_Generator =>
      new ExperimentalInMemorySerialNanoID_Generator({ initialPositions })
]);
