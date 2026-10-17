import { NoInitialConditionsCaseTester } from "../Source";

import TestablePersistentSerialNanoIDsGenerator from
      "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";
import TestableInMemorySerialNanoIDsGenerator from
      "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";


NoInitialConditionsCaseTester.test([
  {
    nameForLogging: TestablePersistentSerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: NoInitialConditionsCaseTester.InstanceCreator.Options):
            Promise<TestablePersistentSerialNanoIDsGenerator> =>
                Promise.resolve(new TestablePersistentSerialNanoIDsGenerator({ ...options }))
  },
  {
    nameForLogging: TestableInMemorySerialNanoIDsGenerator.name,
    instanceCreator:
        async (options: NoInitialConditionsCaseTester.InstanceCreator.Options):
            Promise<TestableInMemorySerialNanoIDsGenerator> =>
              Promise.resolve(new TestableInMemorySerialNanoIDsGenerator({ ...options }))
  }
]);
