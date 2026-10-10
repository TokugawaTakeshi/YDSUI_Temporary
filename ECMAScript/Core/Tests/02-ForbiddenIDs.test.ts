import ForbiddenIDsCaseTester from "../Source/Testing/Testers/ForbiddenIDsCaseTester";

import TestablePersistentSerialNanoIDsGenerator from
      "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";
import TestableInMemorySerialNanoIDsGenerator from
      "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";


ForbiddenIDsCaseTester.test([
  (options: ForbiddenIDsCaseTester.InstanceCreator.Options): ForbiddenIDsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestablePersistentSerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalPersistentSerialNanoIDsGenerator"
      }),
  (options: ForbiddenIDsCaseTester.InstanceCreator.Options): ForbiddenIDsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestableInMemorySerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalInMemorySerialNanoID_Generator"
      })
]);
