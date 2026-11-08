import { AddingOfSeriesCaseTester } from "@yamato-daiwa/serial-unique-identifiers";
import TestableIoredisSerialNanoIDsGenerator from "./TestableImplementations/TestableIoredisSerialNanoIDsGenerator";


AddingOfSeriesCaseTester.test([
  {
    nameForLogging: TestableIoredisSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: AddingOfSeriesCaseTester.InstanceCreator.Options):
            Promise<TestableIoredisSerialNanoIDsGenerator> =>
                Promise.resolve(new TestableIoredisSerialNanoIDsGenerator({ ...options }))
  }
]);
