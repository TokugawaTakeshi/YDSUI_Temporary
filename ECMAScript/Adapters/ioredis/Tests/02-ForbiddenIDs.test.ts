import { ForbiddenIDsCaseTester } from "@yamato-daiwa/serial-unique-identifiers";
import TestableIoredisSerialNanoIDsGenerator from "./TestableImplementations/TestableIoredisSerialNanoIDsGenerator";


ForbiddenIDsCaseTester.test([
  {
    nameForLogging: TestableIoredisSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: ForbiddenIDsCaseTester.InstanceCreator.Options):
            Promise<TestableIoredisSerialNanoIDsGenerator> =>
                Promise.resolve(new TestableIoredisSerialNanoIDsGenerator({ ...options }))
  }
]);
