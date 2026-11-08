import { NoInitialConditionsCaseTester } from "@yamato-daiwa/serial-unique-identifiers";
import TestableIoredisSerialNanoIDsGenerator from "./TestableImplementations/TestableIoredisSerialNanoIDsGenerator";


NoInitialConditionsCaseTester.test([
  {
    nameForLogging: TestableIoredisSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: NoInitialConditionsCaseTester.InstanceCreator.Options):
            Promise<TestableIoredisSerialNanoIDsGenerator> =>
                Promise.resolve(new TestableIoredisSerialNanoIDsGenerator({ ...options }))
  }
]);
