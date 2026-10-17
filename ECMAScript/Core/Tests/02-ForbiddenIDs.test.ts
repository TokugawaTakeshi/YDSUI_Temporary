import ForbiddenIDsCaseTester from "../Source/Testing/Testers/ForbiddenIDsCaseTester";

import TestablePersistentSerialNanoIDsGenerator from
    "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";
import TestableInMemorySerialNanoIDsGenerator from
    "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";


ForbiddenIDsCaseTester.test([
  {
    nameForLogging: TestablePersistentSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: ForbiddenIDsCaseTester.InstanceCreator.Options):
            Promise<TestablePersistentSerialNanoIDsGenerator> =>
                Promise.resolve(new TestablePersistentSerialNanoIDsGenerator({ ...options }))
  },
  {
    nameForLogging: TestableInMemorySerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: ForbiddenIDsCaseTester.InstanceCreator.Options):
            Promise<TestableInMemorySerialNanoIDsGenerator> =>
                Promise.resolve(new TestableInMemorySerialNanoIDsGenerator({ ...options }))
  }
]);
