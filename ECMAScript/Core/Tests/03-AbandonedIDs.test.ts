import { AbandonedIDsCaseTester } from "../Source";
import TestablePersistentSerialNanoIDsGenerator from
      "./TestableImplementations/TestablePersistentSerialNanoIDsGenerator";
import TestableInMemorySerialNanoIDsGenerator from
      "./TestableImplementations/TestableInMemorySerialNanoIDsGenerator";


AbandonedIDsCaseTester.test([
  (options: AbandonedIDsCaseTester.InstanceCreator.Options): AbandonedIDsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestablePersistentSerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalPersistentSerialNanoIDsGenerator"
      }),
  (options: AbandonedIDsCaseTester.InstanceCreator.Options): AbandonedIDsCaseTester.InstanceCreator.Data =>
      ({
        instance: new TestableInMemorySerialNanoIDsGenerator({ ...options }),
        nameForLogging: "ExperimentalInMemorySerialNanoID_Generator"
      })
]);
