import { AbandonedIDsCaseTester } from "@yamato-daiwa/serial-unique-identifiers";
import TestableIoredisSerialNanoIDsGenerator from "./TestableImplementations/TestableIoredisSerialNanoIDsGenerator";


AbandonedIDsCaseTester.test([
  {
    nameForLogging: TestableIoredisSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: AbandonedIDsCaseTester.InstanceCreator.Options):
            Promise<TestableIoredisSerialNanoIDsGenerator> =>
                Promise.resolve(new TestableIoredisSerialNanoIDsGenerator({ ...options }))
  }
]);
